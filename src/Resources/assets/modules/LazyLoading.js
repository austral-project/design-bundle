/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {abstractModule, DomEventManager, Config, Debug } from "@austral/design";

/**
 * LazyLoading class provides functionality to manage lazy loading of various elements, including images, videos, iframes, and background elements.
 * It ensures these elements are only loaded when within the viewport or meet specific offsets, optimizing performance and resource usage.
 *
 * Inherits from the abstractModule class.
 */
export default class LazyLoading extends abstractModule {

  /**
   * Initializes lazy loading if the document body has the "data-lazy-loading" attribute.
   * Sets up necessary arrays for images, videos, iframes, and backgrounds that require lazy loading.
   * Adds an event listener for refreshing lazy-loaded elements.
   *
   * @return {void} This method does not return a value.
   */
  async load() {
    if(!this.isInitialise)
    {
      Debug.log("LazyLoading - Load");
      this.isInitialise = true;
      this.lazyLoadingImages = [];
      this.lazyLoadingVideos = [];
      this.lazyLoadingIframes = [];
      this.lazyLoadingBackgrounds = [];
      DomEventManager.addListener("lazy-loading::refresh", this.refresh.bind(this));
      DomEventManager.addListener(["scroll", "resize", "orientationchange"], this.refresh.bind(this));
    }
  }

  /**
   * Refreshes and updates the lists of lazy-loadable elements including images, videos, iframes,
   * and background elements by identifying elements with the corresponding `data-lazy-load` attributes.
   * Determines if elements meet the lazy-loading criteria based on their bounding rectangle or configuration settings.
   *
   * @return {void} No return value.
   */
  refresh()
  {
    document.querySelectorAll("*[data-lazy-load='image']").forEach((element) => {
      var rect = element.getBoundingClientRect();
      if(Config.lazyLoadingCheckLimit === false) {
        this.lazyLoadingImages.push(element);
      } else if(this.limitSize(rect, element.getAttribute("data-lazy-load-offset"))) {
        this.lazyLoadingImages.push(element);
      }
    });
    document.querySelectorAll("*[data-lazy-load='video']").forEach((element) => {
      var rect = element.getBoundingClientRect();
      if(Config.lazyLoadingCheckLimit === false) {
        this.lazyLoadingVideos.push(element);
      } else if(this.limitSize(rect, element.getAttribute("data-lazy-load-offset"))) {
        this.lazyLoadingVideos.push(element);
      }
    });
    document.querySelectorAll("*[data-lazy-load='iframe']").forEach((element) => {
      var rect = element.getBoundingClientRect();
      if(Config.lazyLoadingCheckLimit === false) {
        this.lazyLoadingIframes.push(element);
      } else if(this.limitSize(rect, element.getAttribute("data-lazy-load-offset"))) {
        this.lazyLoadingIframes.push(element);
      }
    });
    document.querySelectorAll("*[data-lazy-load='background']").forEach((element) => {
      var rect = element.getBoundingClientRect();
      if(Config.lazyLoadingCheckLimit === false) {
        this.lazyLoadingBackgrounds.push(element);
      } else if(this.limitSize(rect, element.getAttribute("data-lazy-load-offset"))) {
        this.lazyLoadingBackgrounds.push(element);
      }
    });
    if(this.lazyLoadingImages.length > 0 || this.lazyLoadingVideos.length > 0 || this.lazyLoadingIframes.length > 0 || this.lazyLoadingBackgrounds.length > 0)
    {
      this.execute();
    }
  }

  /**
   * Limits the size of a rectangle based on the window dimensions and an optional offset.
   *
   * @param {Object} rect - The rectangle object with a `top` property.
   * @param {string|number} offset - An optional offset value. Can be a percentage string (e.g., "10%") or a numeric value.
   * @return {boolean} Returns true if the rectangle's top position plus the offset is less than double the window height plus the scroll position.
   */
  limitSize(rect, offset) {
    let offsetValue = 0;
    if(offset !== undefined && offset)
    {
      if(offset.indexOf("%") > 0)
      {
        let percent = parseFloat(offset.replace("%", ""));
        offsetValue = window.innerHeight/100*(percent);
      }
      else
      {
        offsetValue = offset;
      }
    }
    return (rect.top+offsetValue) < ((window.innerHeight*1.5) + window.scrollY);
  }

  /**
   * Executes the lazy loading functionality for images, videos, iframes, and background elements.
   * Processes the elements from their respective lazy loading collections, updates their sources or properties,
   * and removes them from the collection once loaded. Handles lazy background elements using IntersectionObserver,
   * if supported by the browser.
   *
   * @return {void} Does not return a value.
   */
  execute()
  {
    Debug.startGroup("Lazy loading");
    Debug.log("Images : Start");
    this.lazyLoadingImages.forEach((lazyImage) => {
      Debug.log("LazyImage -> "+lazyImage);
      if(lazyImage.tagName === "PICTURE")
      {
        let image = lazyImage.querySelector("img");
        image.src = image.dataset.src;
        [].forEach.call(lazyImage.querySelectorAll("source"), (source) => {
          source.srcset = source.dataset.srcset ?? source.srcset;
        });
      }
      else
      {
        lazyImage.src = lazyImage.dataset.src;
      }
      this.lazyLoadingImages = this.lazyLoadingImages.filter((item) => {
        return item !== lazyImage;
      });
      lazyImage.removeAttribute("data-lazy-load");
    });
    Debug.log("Images : End");

    Debug.log("Videos : Start");
    this.lazyLoadingVideos.forEach((lazyVideo) => {
      Debug.log("LazyVideo -> "+lazyVideo);
      [].forEach.call(lazyVideo.querySelectorAll("source"), (source) => {
        source.src = source.dataset.src ?? source.src;
      });
      lazyVideo.load();
      this.lazyLoadingVideos = this.lazyLoadingVideos.filter((item) => {
        return item !== lazyVideo;
      });
      lazyVideo.removeAttribute("data-lazy-load");
    });
    Debug.log("Videos : End");

    Debug.log("Iframes : Start");
    this.lazyLoadingIframes.forEach((lazyIframe) => {
      lazyIframe.innerHTML = lazyIframe.dataset.iframe;
      this.lazyLoadingIframes = this.lazyLoadingIframes.filter((item) => {
        return item !== iframe;
      });
    });
    Debug.log("Iframes : End");

    Debug.log("Backgrounds : Start");
    if ("IntersectionObserver" in window) {
      let lazyBackgroundObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            lazyBackgroundObserver.unobserve(entry.target);
          }
        });
      });
      this.lazyLoadingBackgrounds.forEach((lazyBackground) => {
        lazyBackgroundObserver.observe(lazyBackground);
        this.lazyLoadingBackgrounds = this.lazyLoadingBackgrounds.filter((item) => {
          return item !== lazyBackground;
        });
      });
    }
    Debug.log("Backgrounds : Stop");
    Debug.stopGroup("Lazy loading");
  }

}


