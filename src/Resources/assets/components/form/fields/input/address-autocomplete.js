/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {abstractField, DomEventManager, LibLoader, IconRegistry} from "@austral/design";

export default class AddressAutocomplete extends abstractField {

  static initComponent() {
    super.initComponent("address-autocomplete");
  }


  async create(element) {
    super.create(element);

    this.initialValue = this.element.value;
    this.options = Object.assign({
      id: "address",
      api: "photon",
      typeEnabled: "all",
      countryFilter: null,
      language: document.documentElement.getAttribute("lang") ?? "fr",
      noResult: "",
      limit: 10,
    }, this.element.dataset.addressAutocomplete ? JSON.parse(this.element.dataset.addressAutocomplete) : {});

    this.latitudeField = this.formContainer.querySelector("*[data-latitude='"+this.options.id+"']");
    this.longitudeField = this.formContainer.querySelector("*[data-longitude='"+this.options.id+"']");
    this.addressField = this.formContainer.querySelector("*[data-address='"+this.options.id+"']");
    this.cityField = this.formContainer.querySelector("*[data-city='"+this.options.id+"']");
    this.stateField = this.formContainer.querySelector("*[data-state='"+this.options.id+"']");
    this.postCodeField = this.formContainer.querySelector("*[data-postcode='"+this.options.id+"']");
    this.countryCodeField = this.formContainer.querySelector("*[data-country-code='"+this.options.id+"']");
    this.removeButton = this.fieldRow.querySelector("*[data-address-autocomplete-remove]");

    this.autocompleteContent = document.createElement("div");
    this.autocompleteContent.classList.add('autocomplete-content');

    this.autocompleteContainer = document.createElement("div");
    this.autocompleteContainer.classList.add('autocomplete-container');
    this.autocompleteContainer.appendChild(this.autocompleteContent);

    this.element.closest(".field-container").after(this.autocompleteContainer);
    this.currentAbortController = null;
    this.autocompleteContainerHover = false;
    this.addEventListenerAutocomplete();
    this.gsap = await LibLoader.gsap();
  }

  removeButtonView() {
    if(this.removeButton) {
      this.removeButton.style.display = "block";
    }
  }

  removeButtonHide() {
    if(this.removeButton) {
      this.removeButton.style.display = "none";
    }
  }

  addEventListenerAutocomplete() {
    DomEventManager.addListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }, this.element);

    let timeoutRequest;
    DomEventManager.addListener("keyup", (event) => {
      document.body.classList.add("load");
      clearTimeout(timeoutRequest);
      timeoutRequest = setTimeout(() => {
        this.execute();
      }, 500);
    }, this.element);

    DomEventManager.addListener("component::click", (event) => {
      this.close();
    }, this.element);

    DomEventManager.addListener("blur", (event) => {
      if (!this.autocompleteContainerHover) {
        this.close();
      }
    }, this.element);
    DomEventManager.addListener("focus", (event) => {
      if (this.autocompleteContent.children.length > 0) {
        this.open();
      }
    }, this.element);
    DomEventManager.addListener("mouseover", (event) => {
      this.autocompleteContainerHover = true;
    }, this.autocompleteContainer);
    DomEventManager.addListener("mouseleave", (event) => {
      this.autocompleteContainerHover = false;
    }, this.autocompleteContainer);


    if (this.removeButton) {
      DomEventManager.addListener("click", (event) => {
        this.element.value = null;
        if(this.latitudeField) {
          this.latitudeField.value = null;
        }
        if(this.longitudeField) {
          this.longitudeField.value = null;
        }
        if (this.formContainer.classList.contains("auto-submit")) {
          DomEventManager.dispatch("submit", {}, this.formContainer);
        }
        this.removeButtonHide();
      }, this.removeButton);
    }

    if (this.initialValue === undefined || this.initialValue === "") {
      this.removeButtonHide();
    }
  }

  execute() {
    let query = this.element.value;
    if(query.length >= 3)
    {
      this.removeButtonView();
      if (this.currentAbortController) {
        this.currentAbortController.abort();
      }
      this.currentAbortController = new AbortController();
      let fetchOptions = {
        method:       "GET",
        mode:         "cors",
        cache:        "reload",
        credentials:  'same-origin',
        headers:      new Headers(),
        redirect:     "follow",
        signal:       this.currentAbortController.signal,
      };

      this.autocompleteContent.innerHTML = "";
      if(this.options.api === "photon")
      {
        this.executePhoton(query, fetchOptions);
      }
    }
    else
    {
      this.removeButtonHide();
    }
  }

  executePhoton(query, fetchOptions) {
    let nbElement = 0;

    const params = new URLSearchParams({
      q: query,
      limit: this.options.limit,
      lang: this.options.language
    });

    if(this.options.typeEnabled === "address")
    {
      params.set("osm_tag", "place:house");
    }

    fetch("https://photon.komoot.io/api/?"+params.toString(), fetchOptions).then((fetchResponse) => {
      fetchResponse.json().then((json) => {
        if (json.features !== undefined && json.features.length > 0) {
          json.features.forEach((line)=> {
            let addressParameters = {
              "entitled": "",
              "latitude": "",
              "longitude": "",
              "address": "",
              "city": "",
              "postCode": "",
              "country": "",
              "state": ""
            };
            let type = line.properties.type;
            if(this.options.typeEnabled === "all")
            {
              if (type === "street") {
                addressParameters.entitled = line.properties.name + ", " + line.properties.city + " " + line.properties.postcode + ", " + line.properties.country;
              } else if (type === "house" && line.properties.osm_value === "house") {
                addressParameters.entitled = (line.properties.housenumber !== undefined ? line.properties.housenumber + " " : "") + line.properties.street + ", " + line.properties.city + " " + line.properties.postcode + ", " + line.properties.country;
              } else if (type === "city") {
                addressParameters.entitled = line.properties.name + ", " + line.properties.country;
              } else if (type === "district") {
                addressParameters.entitled = line.properties.name + ", " + line.properties.country;
              } else if (type === "country") {
                addressParameters.entitled = line.properties.name;
              }
            }
            else if(this.options.typeEnabled === "address")
            {
              if (type === "street") {
                addressParameters.entitled = line.properties.name + ", " + line.properties.city + " " + line.properties.postcode + ", " + line.properties.country;
                addressParameters.address = line.properties.name;
              } else if (type === "house" && line.properties.osm_value === "house") {
                addressParameters.entitled = (line.properties.housenumber !== undefined ? line.properties.housenumber + " " : "") + line.properties.street + ", " + line.properties.city + " " + line.properties.postcode + ", " + line.properties.country;
                addressParameters.address = (line.properties.housenumber !== undefined ? line.properties.housenumber + " " : "") + line.properties.street;
              }
              addressParameters.city = line.properties.city;
              addressParameters.state = line.properties.state;
              addressParameters.postCode = line.properties.postcode;
            }
            addressParameters.country = line.properties.countrycode;
            addressParameters.latitude = line.geometry.coordinates[1];
            addressParameters.longitude = line.geometry.coordinates[0];
            if(addressParameters.entitled !== "") {
              if(this.options.countryFilter === null || addressParameters.country === this.options.countryFilter)
              {
                this.createElement(addressParameters, nbElement);
                nbElement++;
              }
            }
          });
        }

        if(nbElement === 0) {
          let button = document.createElement("div");

          const pictoLeftContent = IconRegistry.get("pin")?.source;
          let pictoLeft;
          if(pictoLeftContent)
          {
            pictoLeft = document.createElement("span");
            pictoLeft.classList.add("picto");
            pictoLeft.classList.add("stroke");
            pictoLeft.innerHTML = pictoLeftContent;
          }

          button.innerHTML = (pictoLeft ? pictoLeft.innerHTML : "") + "<span class='entitled'>"+this.options.noResult+"</span>";
          let autocompleteElement = document.createElement("div");
          autocompleteElement.classList.add('no-result');
          autocompleteElement.appendChild(button);
          this.autocompleteContent.appendChild(autocompleteElement);
        }
        document.body.classList.remove("load");
        this.open();
      }).catch(error => {
        if (error.name === 'AbortError') {
          // La requête a été annulée, on ignore
          return;
        }
        console.error('Erreur de fetch :', error);
      });
    });
  }


  createElement(addressParameters, nbElement)
  {
    addressParameters = Object.assign({
      "entitled": "",
      "latitude": "",
      "longitude": "",
      "address": "",
      "city": "",
      "postCode": "",
      "country": "",
      "state": ""
    }, addressParameters);

    let button = document.createElement("button");
    button.setAttribute("type", "button");

    const pictoLeftContent = IconRegistry.get("pin")?.source;
    let pictoLeft;
    if(pictoLeftContent)
    {
      pictoLeft = document.createElement("span");
      pictoLeft.classList.add("picto");
      pictoLeft.classList.add("stroke");
      pictoLeft.innerHTML = pictoLeftContent;
    }

    button.innerHTML = (pictoLeft ? pictoLeft.innerHTML : "") + "<span class='entitled'>"+addressParameters.entitled+"</span>";
    let autocompleteElement = document.createElement("div");
    autocompleteElement.classList.add('autocomplete-element');
    if (nbElement === 0) {
      button.classList.add("hover");
      autocompleteElement.classList.add('hover-content');
    }
    autocompleteElement.appendChild(button);
    this.autocompleteContent.appendChild(autocompleteElement);
    DomEventManager.addListener("click", () => {
      DomEventManager.dispatch("autocompleteAdresse::choice-value", {}, button);
      if(this.formContainer.classList.contains("auto-submit")) {
        DomEventManager.dispatch("submit", {}, this.formContainer);
      }
    }, button);
    DomEventManager.addListener("autocompleteAdresse::choice-value", () => {
      console.log(addressParameters);
      this.element.value = addressParameters.entitled;
      if(this.latitudeField)
      {
        this.latitudeField.value = addressParameters.latitude;
      }
      if(this.longitudeField)
      {
        this.longitudeField.value = addressParameters.longitude;
      }
      if(this.countryCodeField)
      {
        if(this.countryCodeField.hasAttribute("data-select"))
        {
          DomEventManager.dispatch("select:choice", {value: addressParameters.country}, this.countryCodeField);
        }
        else
        {
          this.countryCodeField.value = addressParameters.country;
        }
      }
      if(this.addressField)
      {
        this.addressField.value = addressParameters.address;
      }
      if(this.cityField)
      {
        this.cityField.value = addressParameters.city;
      }
      if(this.postCodeField)
      {
        this.postCodeField.value = addressParameters.postCode;
      }
      if(this.stateField)
      {
        this.stateField.value = addressParameters.state;
      }
      this.close();
    }, button);

  }


  open() {
    this.autocompleteContainer.classList.add("view");
    this.gsap.to(this.autocompleteContainer, {duration: 0.2, opacity: 1, marginTop: "0.5rem"});
  }

  close(clear = false) {
    this.autocompleteContainer.classList.remove("view");
    this.gsap.to(this.autocompleteContainer, {duration: 0.2, opacity: 0, marginTop: "1rem", onComplete: ()=>{
      if(clear) {
        this.autocompleteContent.innerHTML = "";
      }
    }});
  }

}


DomEventManager.addListener("component::initialize", () => {
  AddressAutocomplete.initComponent();
});
