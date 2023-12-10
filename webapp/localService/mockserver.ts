import Log from "sap/base/Log";
import MockServer, { Response as MockResponse } from "sap/ui/core/util/MockServer";
import Event from "sap/ui/base/Event";
import UI5Date from "sap/ui/core/date/UI5Date";
// import jQuery from "sap/ui/thirdparty/jquery";
import jQuery from "jquery";

interface MockEventParameters {
    oXhr?: Response;
    oFilteredData: {
        results: object[]
    };
}
type MockEvent = Event<
    MockEventParameters
>;

export default class mockserver {

    public static init() {
        // create
        const oMockServer = new MockServer({
            rootUri: "/"
        });

        // configure mock server with the given options or a default delay of 0.5s
        MockServer.config({
            autoRespond: true,
            autoRespondAfter: 500
        });

        // simulate against the metadata and mock data
        oMockServer.simulate("../localService/metadata.xml", {
            sMockdataBaseUrl: "../localService/mockdata",
            bGenerateMissingMockData: true
        });

        // handling mocking a function import call step
        const aRequests = oMockServer.getRequests();
        aRequests.push({
            method: "GET",
            path: new RegExp("FindUpcomingMeetups(.*)"),
            response: (oXhr: MockResponse) =>  {
                Log.debug("Incoming request for FindUpcomingMeetups");
                const today = UI5Date.getInstance();
                today.setHours(0); // or today.toUTCString(0) due to timezone differences
                today.setMinutes(0);
                today.setSeconds(0);
                today.setFullYear(2019);
                
                // MockServer with Simon will catch the request below
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                jQuery.ajax({
                    url: "/Meetups?$filter=EventDate ge " + "/Date(" + today.getTime() + ")/",
                    dataType: 'json',
                    async: false,
                    success: function (oData: object) {
                        oXhr.respondJSON(200, {}, JSON.stringify(oData));
                    }
                });
                return true;
            }
        });
        oMockServer.setRequests(aRequests);

        // handling custom URL parameter step
        const fnCustom = function (oEvent: MockEvent) {
            const oXhr = oEvent.getParameter("oXhr");
            if (oXhr && oXhr.url.indexOf("first") > -1) {
                console.log(oXhr.url)
                oEvent.getParameter("oFilteredData").results.splice(3, 100);
            }
        };
        oMockServer.attachAfter("GET", fnCustom, "Meetups");       

        // start        
        oMockServer.start();

        

        Log.info("Running the app with mock data");
    }
}