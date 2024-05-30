import abstractField from "./abstract";

export default class AutocompleteAddress extends abstractField {

  static initComponent() {
    super.initComponent("autocomplete-address");
  }

  create(element) {
    super.create(element);
    this.initialValue = this.element.value;
    this.options = JSON.parse(this.element.dataset.autocompleteAddress);
    this.options = Object.assign({
      "id": "autocomplete-address",
      "requestLimit":  10,
      "limitEnabled": 3,
      "type": ""
    }, this.options);


    this.autocompleteContent = document.createElement("div");
    this.autocompleteContent.classList.add('autocomplete-content');

    this.autocompleteContainer = document.createElement("div");
    this.autocompleteContainer.classList.add('autocomplete-container');
    this.autocompleteContainer.appendChild(this.autocompleteContent);
    this.element.closest(".field").after(this.autocompleteContainer);
    this.element.closest(".field-content").classList.add("field-autocomplte-address-content")
  }


  addEventListener() {
    MiscEvent.addListener("keyup", ()=>{
      this.execute();
      MiscEvent.dispatch("component::form.change", { field: this, key: this.element.getAttribute("id"), change: (this.initialValue !== this.element.value) }, this.formContainer);
    }, this.element);
    MiscEvent.addListener("component::close-all", (event)=>{
      this.close();
    });
  }

  execute() {
    if(this.element.value.length >= this.options.limitEnabled)
    {
      let fetchOptions = {
        method:       "GET",
        mode:         "cors",
        cache:        "reload",
        credentials:  'same-origin',
        headers:      new Headers(),
        redirect:     "follow",
      };
      fetch("https://api-adresse.data.gouv.fr/search/?limit="+this.options.requestLimit+"&type="+this.options.type+"&q="+this.element.value, fetchOptions).then((fetchResponse) => {
        this.autocompleteContent.innerHTML = "";
        fetchResponse.json().then((json) => {
          if(json.features !== undefined && json.features.length > 0 )
          {
            this.open();
            json.features.forEach((line)=>{
              let button = document.createElement("button");
              button.setAttribute("type", "button");
              button.innerHTML = "<span class='entitled'>"+line.properties.label+"</span><span class='context'>"+line.properties.context+"</span>"
              let autocompleteElement = document.createElement("div");
              autocompleteElement.classList.add('autocomplete-element');
              autocompleteElement.appendChild(button);
              this.autocompleteContent.appendChild(autocompleteElement);
              MiscEvent.addListener("click", ()=>{
                this.element.value = line.properties.label;
                ["name", "postcode", "city", "latitude", "longitude"].forEach((typeValue) => {
                  let inputTypeValue = document.querySelector("*[data-autocomplete-address-field='"+this.options.id+"-"+typeValue+"']");
                  if(inputTypeValue)
                  {
                    if(typeValue === "latitude")
                    {
                      inputTypeValue.value = line.geometry.coordinates[1];
                    }
                    else if(typeValue === "longitude")
                    {
                      inputTypeValue.value = line.geometry.coordinates[0];
                    }
                    else
                    {
                      inputTypeValue.value = line.properties[typeValue];
                    }
                  }
                });
                this.close();
              }, button);
            })
          }
          else
          {
            this.close();
          }
        });
      });
    }
  }

  open() {
    this.autocompleteContainer.classList.add("view");
  }
  close() {
    this.autocompleteContainer.classList.remove("view");
  }

}