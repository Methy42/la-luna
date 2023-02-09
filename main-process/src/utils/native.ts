import { execSync } from "child_process";
import constant from "./constant";

export const getSystemDiskSerialNumber = {
    "aix": function () { return "" },
    "android": function () { return "" },
    "cygwin": function () { return "" },
    "darwin": function () { return "" },
    "freebsd": function () { return "" },
    "haiku": function () { return "" },
    "linux": function () {
        return execSync("lsblk --nodeps -no serial /dev/$(eval $(lsblk -oMOUNTPOINT,PKNAME -P | grep 'MOUNTPOINT=\"/\"'); echo $PKNAME)").toString("utf8");
    },
    "netbsd": function () { return "" },
    "openbsd": function () { return "" },
    "sunos": function () { return "" },
    "win32": function () {
        return execSync(constant.windowsGetSerialNumberToolPath).toString("utf8").split("\n")[0];
    }
}[process.platform];