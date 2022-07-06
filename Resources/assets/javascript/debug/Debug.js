export default class Debug  {

  /**
   * @param a
   */
  static log(a) {
    for(var i = 0; i < arguments.length; i++ )
    {
      console.log(arguments[i]);
    }
  }

  static startGroup(groupName = null) {
    console.groupCollapsed(groupName)
  }

  static stopGroup() {
    console.groupEnd();
  }
}