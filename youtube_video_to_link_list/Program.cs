using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using Newtonsoft.Json;

class Program
{
    static void Main()
    {
        try
        {
            string url = "";

            while (true)
            {
                Console.WriteLine("Please enter the url of the youtube channel you want to get the video links from: ");
                url = Console.ReadLine();

                if (url == "https://www.youtube.com" || url == "www.youtube.com")
                {
                    Console.WriteLine("Please enter a valid url.");
                    continue;
                }

                if (CheckUrl(url))
                {
                    url = urlConverter(url);
                    break;
                }
                else
                {
                    Console.WriteLine("Please enter a valid url.");
                }
            }

            List<VideoInfo> videoInfos = new List<VideoInfo>();

            ChromeOptions options = new ChromeOptions();
            options.SetLoggingPreference(LogType.Browser, LogLevel.All);
            options.AddArguments("--lang=en");
            IWebDriver driver = new ChromeDriver(options);
            driver.Url = url;

            IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
            string scriptjsPath = "../../../script.js";
            string scriptjs = File.ReadAllText(scriptjsPath);
            js.ExecuteScript(scriptjs);

            while (true)
            {
                if (driver.FindElement(By.TagName("body")).GetAttribute("class").Contains("stop_gokboerue"))
                {
                    break;
                }
                else
                {
                    Thread.Sleep(1000);
                    Console.WriteLine("Please wait... Videos Scanning...");
                }
            }


            var logs = driver.Manage().Logs.GetLog(LogType.Browser).Select(x => x.Message).ToList();

            foreach (var log in logs)
            {
                if (log.Contains("JSON VIDELIST: "))
                {
                    int startIndex = log.IndexOf("[");
                    int endIndex = log.LastIndexOf("]");

                    var json = log.Substring(startIndex, endIndex - startIndex + 1).Replace("\\", "");

                    videoInfos = JsonConvert.DeserializeObject<List<VideoInfo>>(json);
                }
            }

            videoInfos.Reverse();

            foreach (var videoInfo in videoInfos)
            {
                Console.WriteLine(videoInfo);
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
        }
    }

    public static bool CheckUrl(string url)
    {
        if (url == null)
        {
            return false;
        }
        else if (url.Contains("youtube.com/"))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    public static string urlConverter(string url)
    {
        List<string> urlTypes = new List<string> { "featured", "shorts", "streams", "playlists", "community", "channels", "about" };

        foreach (string type in urlTypes)
        {
            if (url.Contains(type))
            {
                return url.Replace(type, "videos");
            }
        }

        return url;
    }
}

public class VideoInfo
{
    public string title { get; set; }
    public string href { get; set; }

    public VideoInfo(string title, string href)
    {
        this.title = title;
        this.href = href;
    }

    override public string ToString()
    {
        return title + " " + href;
    }
}