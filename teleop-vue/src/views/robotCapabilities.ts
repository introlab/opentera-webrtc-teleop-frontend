const DEFAULT_ROBOT_TYPE = "BEAM";

export function robotCapabilities(robotType: string | null | undefined) {
    robotType = robotType || DEFAULT_ROBOT_TYPE;
    return {
        robotCaps: {
            isMobile: robotType != "TTOP",
            isSingleCamera: robotType == "TTOP",
            usesMap: robotType != "TTOP",
            hasTtopHeadMovements: robotType == "TTOP",
        }
    };
}
