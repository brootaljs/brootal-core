export default function(url, service) {
    return class RemoteClass {
        static __url = url
        static __service = service
        static __isRemote = true
    };
}
