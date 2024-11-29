/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {hostname: "uploadthing.com"},
            {hostname: "utfs.io"},
        ]
    },
    trailingSlash: true,
}

module.exports = nextConfig
