import {captureScreen} from "react-native-view-shot";
import Share from "react-native-share";

export const shareScreen = () => {
    captureScreen({
        format: "png",
        quality: 0.8,
        handleGLSurfaceViewOnAndroid: true
    }).then(
        (uri) => {
            console.log("Image saved to", uri);
            Share.open({
                url: uri,
                failOnCancel: false,
                saveToFiles: false,
                isNewTask: true
            })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    err && console.log(err);
                });
        },
        (error) => console.error("Oops, snapshot failed", error)
    );
};