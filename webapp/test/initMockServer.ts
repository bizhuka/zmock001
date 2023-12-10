import MessageBox from "sap/m/MessageBox";
import mockserver from "zmock001/localService/mockserver";


export default class InitMock {

    static {
        // initialize the mock server
        try {
            mockserver.init();
        } catch (oError) {
            MessageBox.error((oError as Error).message);
        }

        // initialize the embedded component on the HTML page
        sap.ui.require(["sap/ui/core/ComponentSupport"]);
    }
}
