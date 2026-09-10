import "./globals.css";

import ReduxProvider from "./components/Provider";

export const metadata = {
  title: "TaskFlow - Task Management",
  description: "Task Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}