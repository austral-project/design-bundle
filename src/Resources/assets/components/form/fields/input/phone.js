import {abstractField, DomEventManager, LibLoader} from "@austral/design";

export default class Phone extends abstractField {

  static initComponent() {
    super.initComponent("phone", () => {});
  }

  async create(element) {
    super.create(element);
    this.intlTelInput = await LibLoader.intlTelInput();

    let fieldPhoneKeyname = element.getAttribute("data-phone");

    let phoneFull = this.fieldRow.querySelector(
      `*[data-phone-full='${fieldPhoneKeyname}']`
    ) || this.formContainer?.querySelector(
      `*[data-phone-full='${fieldPhoneKeyname}']`
    );

    let phoneCountry = this.fieldRow.querySelector(
      `*[data-phone-country='${fieldPhoneKeyname}']`
    ) || this.formContainer?.querySelector(
      `*[data-phone-country='${fieldPhoneKeyname}']`
    );

    const iti = this.intlTelInput["intlTelInput"](element, {
      initialCountry: "auto",
      geoIpLookup: (success, failure) => {
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(data => success(data.country_code))
          .catch(() => failure());
      },
      i18n: document.documentElement.lang === "fr" ? this.intlTelInput["i18n"].fr : this.intlTelInput["i18n"].en,
      strictMode: true,
      separateDialCode: true,
      validationNumberTypes: ["FIXED_LINE", "MOBILE", "FIXED_LINE_OR_MOBILE"],
      loadUtils: () => Promise.resolve({ default: this.intlTelInput["utils"] }),
    });

    await iti.promise;

    phoneFull.value = iti.getNumber();
    phoneCountry.value = iti.getSelectedCountryData().iso2;

    DomEventManager.addListener(
      ["keyDown:enter", "keyup", "field::change", "change"],
      () => {
        phoneFull && (phoneFull.value = iti.getNumber());
        phoneCountry && (phoneCountry.value = iti.getSelectedCountryData().iso2);
      },
      this.element
    );
  }
}

DomEventManager.addListener("component::initialize", () => {
  Phone.initComponent();
});
