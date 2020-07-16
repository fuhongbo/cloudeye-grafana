using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ReverseProxy
{
    public class ReverseProxy
    {
        static HttpClient _http = new HttpClient();

        public static async Task Invoke(HttpContext context)
        {
            var url = context.Request.Path.ToUriComponent();
            
            var uri = new Uri("https://ces.cn-north-4.myhuaweicloud.com" + url+context.Request.QueryString.ToUriComponent());
            
            if (url.Contains("tokens"))
            {
                uri = new Uri("https://iam.cn-north-4.myhuaweicloud.com" + url);
            }
            

            
            var request   = CopyRequest(context, uri);
            
            var remoteRsp = await _http.SendAsync(request);
            var rsp       = context.Response;

            foreach (var header in remoteRsp.Headers)
            {
                rsp.Headers.Add(header.Key, header.Value.ToArray());
            }

            rsp.ContentType   = remoteRsp.Content.Headers.ContentType?.ToString();
            rsp.ContentLength = remoteRsp.Content.Headers.ContentLength;
            rsp.StatusCode = (int)remoteRsp.StatusCode;

            await remoteRsp.Content.CopyToAsync(rsp.Body);
        }


        static HttpRequestMessage CopyRequest(HttpContext context, Uri targetUri)
        {
            var req = context.Request;
            var requestMessage = new HttpRequestMessage()
            {
                Method     = new HttpMethod(req.Method),
                Content    = new StreamContent(req.Body),
                RequestUri = targetUri,
            };
            
            foreach (var header in req.Headers)
            {
                requestMessage.Content?.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
            }

            requestMessage.Headers.Host = targetUri.Host;

            return requestMessage;
        }
    }
}