import setting from './settings'

export default function artplayerPluginOnline(option) {
    return (art) => {
        setting(art, option);
        return {
            name: 'artplayerPluginOnline',
            something: 'artplayerPluginOnline',
            doSomething: function () {
                console.info('artplayerPluginOnline');
            },
        };
    };
}
