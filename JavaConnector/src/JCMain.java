import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class JCMain
{

	public static void main(String[] args)
	{
		if (args.length < 2)
		{
			System.out.println("Usage: [fromip:fromport] [toip:toport]");
			System.exit(0);
		}

		String[] spl = args[0].split(":");
		String fromIP = spl[0];
		int fromPort = Integer.parseInt(spl[1]);
		spl = args[1].split(":");
		String toIP = spl[0];
		int toPort = Integer.parseInt(spl[1]);

		while (true)
		{
			try
			{
				Socket a = new Socket(fromIP, fromPort);
				Socket b = new Socket(toIP, toPort);
				forward(a, b);
				forward(b, a);
			}
			catch (IOException e) {}
		}
	}

	private static int numThreads;

	private static void forward(Socket a, Socket b)
	{
		new Thread("Forward thread") {
			@Override
			public void run() {
				numThreads++;
				System.out.println("AD: " + numThreads);
				try
				{
					InputStream is = a.getInputStream();
					OutputStream os = b.getOutputStream();
					byte[] buffer = new byte[1024];
					int read;
					while ((read = is.read(buffer)) > 0)
					{
						os.write(buffer, 0, read);
					}
					safeClose(a);
					safeClose(b);
				}
				catch (Exception e)
				{
					//e.printStackTrace();
				}
				numThreads--;
				System.out.println("RM: " + numThreads);
			}
		}.start();
	}

	private static void safeClose(Socket socket)
	{
		try
		{
			socket.close();
		}
		catch (Exception e) {}
	}
}
