const navigation = [
  {
    name: "Twitter",
    href: "https://twitter.com/nance_app",
    icon: (props: any) => (
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 50 50" aria-hidden="true">
        <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/nance-eth",
    icon: (props: any) => (
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.gg/SUyeNcEuaK",
    icon: (props: any) => (
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 127.14 96.36">
        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
      </svg>
    ),
  },
  {
    name: "Juicebox",
    href: "https://juicebox.money/@nance-app",
    icon: (props: any) => (
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 73 94">
        <path d="m72.97,11.56c-.08-.66-.39-1.23-.91-1.68-.48-.43-1.1-.71-1.59-.93l-.44-.21c-1.01-.48-2.03-.95-3.07-1.42l-.6-.27c-1.12-.49-2.25-.98-3.38-1.46,0,0-3.79-1.61-4.58-1.96-1.11-.48-2.23-.93-3.35-1.37l-1.77-.71c-1.87-.76-3.81-1.55-5.86-1.55-1.36,0-2.57.35-3.7,1.06-1.3.81-2.13,2.04-2.45,3.63-.41,1.95-1.47,6.23-2.44,10.05-.21.85-1.05,1.37-1.91,1.21-1.69-.31-3.39-.61-5.08-.89-2.33-.39-4.63-1.02-7.02-1.2-2.36-.15-4.69.5-6.98,1.06-5,1.2-9.9,2.88-14.55,5.09-1.22.6-1.51,1.2-1.53,2.49-.1,4.75-.83,9.57-1.12,14.32-.31,5.17-.5,10.34-.6,15.54-.18,10.54,0,21.21,1.63,31.65.06.35.19.75.17,1.12,0,.27.06.56.21.81.25.46,1.01,1.85,14.94,5.02,4.09.93,14.03,3.03,20.42,3.03.25,0,.52,0,.78-.02,15-.44,20.09-6.52,20.31-6.77.39-.5.64-.79,1.03-11.02.23-5.77.45-13.53.58-21.33.16-8.22.23-15.79.19-21.33-.02-2.32-.02-4.61-.12-6.91-.04-1-.1-2.01-.23-2.99-.21-1.52-1.53-2.05-2.81-2.59-.52-.21-1.09-.42-1.63-.62-1.26-.46-2.56-.85-3.86-1.22-.25-.08-2.91-.81-3-.81l-.71-.15c-.62-.14-1.57-.91-1.31-2.24l1.76-7.47c.24-.15.58-.38.87-.67l2.25.97c.45.19,15.4,6.57,15.56,6.64.27.11.52.21.8.35l.2.09c.13.06.26.11.42.17.25.09.58.22.98.25.29,0,.52-.06.75-.12.46-.14.89-.42,1.3-.83.39-.39.71-.83.95-1.35.42-.88.57-1.71.47-2.46ZM10.89,81.88c-.12.22-.4.31-.63.2-.23-.11-.33-.38-.26-.63l8.38-25.85-13.47-1.3c-.19-.02-.35-.14-.42-.32-.05-.18-.02-.38.1-.52l16.52-18.99c.16-.18.43-.22.62-.07.21.13.28.4.19.63l-5.04,11.79c-.08.18.06.39.26.39h13.51c.17,0,.33.09.42.25.09.16.09.36,0,.5l-20.2,33.92Zm25.82,6.26c-.02.46-.43.81-.97.81-3.51.11-8.95-.11-13.97-1.27-.34-.08-.28-.57.07-.59,15.39-.88,10.91-32.77,14.16-50.77,3.17-17.61.99,44.12.71,51.83Zm12.77-64c1.4-.28,2.82-.44,4.24-.52,2.1-.11,2.22-.17,1.84.2-.29.28-.9.42-1.26.56-.56.22-1.14.42-1.71.62-2.55.88-5.14,1.67-7.73,2.45-1.9.57-3.8,1.16-5.72,1.62-.29.07-.58.13-.87.17-1.39.19-2.77-.01-4.14-.27-1.92-.37-3.83-.78-5.73-1.25-5.25-1.28-10.48-2.66-15.7-4.1-5.28-1.51-6.16-2.41.4-1.47.23.03.43.05.64.07,3.53.54,7.1,1.01,10.61,1.56,5.23.82,10.61,1.95,15.92,1.66,3.1-.16,6.16-.69,9.2-1.3Z"/>
      </svg>
    )
  }
];

export default function Footer() {
  return (
    <footer className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &infin; Built with{" "}
            <a
              href={`https://github.com/nance-eth/nance-interface/tree/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
            >
              {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
                "dev"}
            </a>
          </p>
        </div>
        <div className="flex justify-center text-center">
          <iframe
            src="https://status.nance.app/badge?theme=light"
            width="200"
            height="30"
          ></iframe>
        </div>
        <div className="flex justify-center space-x-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              rel="noreferrer"
              target="_blank"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
