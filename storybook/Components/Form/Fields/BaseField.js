export const baseFieldArgTypes = {
  id: {
    name: 'ID',
    description: 'Field ID',
    control: {type: 'text', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
  name: {
    name: 'Name',
    description: 'Field name',
    control: {type: 'text', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
  label: {
    name: 'Label',
    description: 'Field label',
    control: {type: 'text'},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
  labelPosition: {
    name: 'Label Position',
    description: 'Position for the label',
    options: ['default', 'external'],
    control: {type: 'select', required: true},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'external'}
    }
  },
  disabled: {
    name: 'Disabled',
    description: 'Disabled',
    control: {type: 'boolean'},
  },
  required: {
    name: 'Required',
    description: 'Required field',
    control: {type: 'boolean'},
  },
  errorValue: {
    name: 'Error',
    description: 'Error value',
    control: {type: 'text' },
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    },
  },
  helper: {
    table: {
      disable: true,
    },
  },
  helperValue: {
    name: 'Helper',
    description: 'Helper value',
    control: {type: 'text' },
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    },
  },
  value: {
    name: 'Value',
    description: 'Field value',
    control: {type: 'text'},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
  before: {
    table: {
      disable: true,
    },
  },
  beforeValue: {
    name: 'Before',
    description: 'Before value',
    control: {type: 'text'},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
  beforeBackground: {
    name: 'Background for before',
    description: 'Background for after',
    control: {type: 'boolean'},
  },
  after: {
    table: {
      disable: true,
    },
  },
  afterValue: {
    name: 'After',
    description: 'After value',
    control: {type: 'text'},
    table: {
      type: {summary: 'string'},
      defaultValue: {summary: 'null'}
    }
  },
  afterBackground: {
    name: 'Background for after',
    description: 'Background for after',
    control: {type: 'boolean'},
  },
  choices: {
    table: {
      disable: true,
    },
  },
};