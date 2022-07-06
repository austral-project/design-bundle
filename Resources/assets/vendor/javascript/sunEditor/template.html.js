import { config } from "../../../javascript/config/Config";
var optionsSelectAustralLinks = "";
if(config.getAustralLinks())
{
  optionsSelectAustralLinks += "<option value=''></option>";
  config.getAustralLinks().forEach((value, i) => {
    optionsSelectAustralLinks += "<option value='"+value[0]+"'>"+value[1]+"</option>";
  });
}
export const template = '<form class="popin-suneditor-links"> \
  <div class="group-fields-container group-popup-component-link-editor-fields-container ">\
    <div class="group-fields-content group-row ">\
      <div class="group-col col--4 ">\
        <div class="group-fields-container group-component-choice-type-link-fields-container">\
          <span class="group-fields-name">Éditeur de lien</span>\
          <div class="group-fields-content group-column ">\
            <div class="group-col auto ">\
              <div class="field-content field-content-choiceField">\
                <div class="field field-choiceType-radio">\
                  <div class="choice-element-container theme-2 column">\
                    <div class="list-option-container" data-choice-element="" data-choice-direction="vertical" data-view-by-choices="{&quot;internal&quot;:&quot;.component-type-url-internal&quot;,&quot;external&quot;:&quot;.component-type-url-external&quot;,&quot;email&quot;:&quot;.component-type-url-email&quot;,&quot;phone&quot;:&quot;.component-type-url-phone&quot;}" data-choice-element-reinit-parent=".popin-suneditor-links" data-choice-value-checked="" data-view-by-choices-parent=".popin-suneditor-links" data-choice-element-styles="{&quot;phone&quot;:[],&quot;email&quot;:[],&quot;external&quot;:[],&quot;internal&quot;:[]}">\
                      <span class="current-background animate"></span>\
                      <ul class="list-option-element">\
                        <li class="option-element " data-choice-element-value="internal" style="">\
                          <span class="entitled font-poppins-m-11"><label>Page interne</label></span>\
                          <input type="radio" class="field_choices_component_link_type_internal" value="internal"/>\
                        </li>\
                        <li class="option-element " data-choice-element-value="external" style="">\
                          <span class="entitled font-poppins-m-11"><label>Page externe</label></span>\
                          <input type="radio" class="field_choices_component_link_type_external" value="external"/>\
                        </li>\
                        <li class="option-element " data-choice-element-value="email" style="">\
                          <span class="entitled font-poppins-m-11"><label>Email</label></span>\
                          <input type="radio" class="field_choices_component_link_type_external" value="email"/>\
                        </li>\
                        <li class="option-element " data-choice-element-value="phone" style="">\
                          <span class="entitled font-poppins-m-11"><label>Phone</label></span>\
                          <input type="radio" class="field_choices_component_link_type_external" value="phone"/>\
                        </li>\
                      </ul>\
                    </div>\
                  </div>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="group-col col--8">\
        <div class="group-fields-container group-component-link-fields-container">\
          <span class="group-fields-name">Valeur du lien</span>\
          <div class="group-fields-content group-column ">\
            <div class="group-col auto ">\
              <div class="field-content field-content-textField">\
                <label class="">Intitulé</label>\
                <div class="field field-textType">\
                  <input type="text" class="_se_link_text"/>\
                </div>\
              </div>\
            </div>\
            <div class="group-col auto ">\
              <div class="field-content field-content-selectField view-element-by-choices component-type-url-internal">\
                <label class="">Page</label>\
                <div class="field field-choiceType field-select-type">\
                  <select class="view-element-by-choices component-type-url-internal _se_link_choice" data-select="" data-select-options="{&quot;tag&quot;:false,&quot;addItems&quot;:true,&quot;editItems&quot;:true,&quot;removeItems&quot;:true,&quot;searchEnabled&quot;:true,&quot;placeholder&quot;:true,&quot;placeholderValue&quot;:null,&quot;searchPlaceholderValue&quot;:null,&quot;delimiter&quot;:&quot;, &quot;,&quot;duplicateItemsAllowed&quot;:false}">\
                  '+optionsSelectAustralLinks+'\
                  </select>\
                </div>\
              </div>\
            </div>\
            <div class="group-col auto">\
              <div class="field-content field-content-textField view-element-by-choices component-type-url-internal">\
                <label class="">Ancre</label>\
                <div class="field field-textType">\
                  <input type="text" class="view-element-by-choices component-type-url-internal _se_link_anchor"/>\
                </div>\
              </div>\
            </div>\
            <div class="group-col auto ">\
              <div class="field-content field-content-textField view-element-by-choices component-type-url-external">\
                <label class="">Url de la page</label>\
                <div class="field field-textType">\
                  <input type="text" class="view-element-by-choices component-type-url-external _se_link_url"/>\
                </div>\
              </div>\
\
            </div>\
            <div class="group-col auto ">\
              <div class="field-content field-content-textField view-element-by-choices component-type-url-email">\
                <label class="">Email </label>\
                <div class="field field-textType">\
                  <input type="text" class="view-element-by-choices component-type-url-email _se_link_email"/>\
                </div>\
              </div>\
            </div>\
            <div class="group-col auto ">\
              <div class="field-content field-content-textField view-element-by-choices component-type-url-phone">\
                <label class="">Phone </label>\
                <div class="field field-textType">\
                  <input type="text" class="view-element-by-choices component-type-url-phone _se_link_phone"/>\
                </div>\
              </div>\
            </div>\
            <div class="group-col auto ">\
              <div class="field-content field-content-switchField side-by-side view-element-by-choices component-type-url-internal component-type-url-external" style="--switch-button-color-enabled:var(--color-white-force); --switch-button-color-disabled:var(--color-white-force); --switch-fond-color-enabled:var(--color-green-40); --switch-fond-color-disabled:var(--color-main-40);">\
                <label class="">Ouvrir dans un nouvel onglet</label>\
                <div class="field field-checkboxType">\
                  <div class="switch-type switch-element heads" data-switch="" data-switch-input="" style="">\
                    <input type="checkbox" class="side-by-side view-element-by-choices component-type-url-internal component-type-url-external se-input-select" value="1" />\
                    <div class="switch-button-content">\
                      <span class="switch-button">\
                        <span class="indicator"></span>\
                      </span>\
                    </div>\
                  </div>\
                </div>\
              </div>\
            </div>\
            <div class="group-col auto ">\
              <div class="button-content">\
                <span class="button  button-text" title="Supprimer le lien" tabindex="0" role="button" aria-pressed="false">\
                  <span class="entitled ">Annuler</span>\
                </span>\
                <button type="submit" class="button font-poppins-m-13-uppercase-white button-action " title="Enregistrer" tabindex="0" role="button" aria-pressed="false">\
                  <span class="entitled ">Enregistrer</span>\
                </button>\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>\
  </div>\
</form>';