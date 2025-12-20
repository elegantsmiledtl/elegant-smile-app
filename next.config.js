/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    webpack: (config) => {
        config.optimization.minimize = true;
        return config;
    },
};

module.exports = nextConfig;