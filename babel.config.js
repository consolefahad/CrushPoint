module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin',
            ['module:react-native-dotenv', {
                moduleName: '@env',
                path: '.env',
                safe: false,
                allowUndefined: true,
            }],
        ],
    };
};