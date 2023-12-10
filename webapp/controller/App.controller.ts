import BaseController from "./BaseController";
import List from "sap/m/List";
import ObjectListItem from "sap/m/ObjectListItem";
import ObjectAttribute from "sap/m/ObjectAttribute";

/**
 * @namespace zmock001.controller
 */
export default class App extends BaseController {
	public onInit(): void {
		// apply content density mode to root view
		this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
	}

	/**
	 * Responds to the button press event.
	 * Upon pressing, we bind the items aggregation of the list to the "Meetups" entityset.
	 * We pass a custom URL parameter "first=3" (assuming our OData BE knows how to process it).
	 */
	public onPress() {
		const oList = this.byId("list") as List;
		oList.bindItems({
			path: "/Meetups",
			// length: 3,
			parameters: {
				custom: { $top: "3", first: "555" }
			},
			template: new ObjectListItem({
				title: "{Title}",
				number: {
					path: 'EventDate',
					type: 'sap.ui.model.type.DateTime',
					formatOptions: {
						style: 'short'
					}
				},
				attributes: [
					new ObjectAttribute({
						text: "{Description}"
					})
				]
			})
		});
	}
}
