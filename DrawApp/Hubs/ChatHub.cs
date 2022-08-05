using Microsoft.AspNetCore.SignalR;

namespace DrawApp.Hubs;

public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
    
    public async Task SendDrawing(string points)
    {
        await Clients.Others.SendAsync("ReceivePoints", points);
    }
}
