import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

import { ThemeProvider } from '@/providers/theme-provider'
import { cn } from '@/lib/utils'
import { ModalProvider } from "@/providers/ModalProvider";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { SocketProvider } from '@/providers/SocketProvider';
import { QueryProvider } from '@/providers/QueryProvider';

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cutting Edge',
  description: 'With love by DJ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem storageKey='discord-clone'>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)}/>
            <SocketProvider>
            <QueryProvider>

            <ModalProvider />
            {children}
            </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
