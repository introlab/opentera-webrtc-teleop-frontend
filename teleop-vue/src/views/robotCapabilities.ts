export function robotCapabilities(robotType: string | null | undefined) {
    robotType = robotType || "BEAM";
    return {
        isRobotMobile: robotType != "TTOP",
        isRobotSingleCamera: robotType == "TTOP",
        doesRobotUseMap: robotType != "TTOP",
    };
}
