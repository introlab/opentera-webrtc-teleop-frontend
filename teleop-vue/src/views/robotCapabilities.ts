const DEFAULT_ROBOT_TYPE = "BEAM";

export function robotCapabilities(robotType: string | null | undefined) {
    robotType = robotType || DEFAULT_ROBOT_TYPE;
    return {
        isRobotMobile: robotType != "TTOP",
        isRobotSingleCamera: robotType == "TTOP",
        doesRobotUseMap: robotType != "TTOP",
    };
}
