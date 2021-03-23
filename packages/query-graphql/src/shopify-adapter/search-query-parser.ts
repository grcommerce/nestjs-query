const compiledGrammar = {
  table: [
    [0, 'source', 1],
    [0, 'start', 2],
    [3, 3, 4],
    [0, 'EOF', 5],
    [4, 6, 7, 3],
    [4, 8, 9],
    [0, 'Query', 10],
    [6, 11],
    [9, 12],
    [5, ''],
    [4, 13, 14, 15],
    [2, '[\\s]'],
    [1],
    [8, 16],
    [0, 'Term', 17],
    [6, 18],
    [0, 'Whitespace', 19],
    [4, 20, 21],
    [4, 22, 16, 14],
    [7, 11],
    [8, 23],
    [3, 24, 25, 26],
    [8, 27],
    [0, 'MatchMode', 28],
    [0, 'Subquery', 29],
    [0, 'Pair', 30],
    [0, 'Keyword', 31],
    [4, 16, 32],
    [3, 33, 34],
    [4, 35, 6, 36],
    [4, 37, 38, 39, 40],
    [0, 'String', 41],
    [0, 'Connective', 42],
    [5, '-'],
    [5, '+'],
    [5, '('],
    [5, ')'],
    [0, 'BareWord', 43],
    [5, ':'],
    [8, 44],
    [0, 'Attribute', 45],
    [3, 46, 47, 37],
    [3, 48, 49],
    [4, 50, 51],
    [0, 'Operator', 52],
    [0, 'AnyValue', 53],
    [0, 'DoubleQuotedString', 54],
    [0, 'SingleQuotedString', 55],
    [5, 'AND'],
    [5, 'OR'],
    [2, '[^\\s,\'"(:]'],
    [6, 56],
    [3, 57, 58, 59, 60],
    [3, 61, 62, 31],
    [4, 63, 64, 63],
    [4, 65, 66, 65],
    [2, '[^ "):]'],
    [5, '<='],
    [5, '>='],
    [5, '<'],
    [5, '>'],
    [0, 'Date', 67],
    [0, 'Numeric', 68],
    [5, '"'],
    [6, 69],
    [5, "'"],
    [6, 70],
    [4, 71, 72],
    [3, 73, 74],
    [2, '[^"]'],
    [2, "[^']"],
    [5, 'D'],
    [0, 'QuotedString', 75],
    [0, 'Float', 76],
    [0, 'Integer', 77],
    [3, 46, 47],
    [4, 78, 79, 78, 80],
    [4, 78, 81],
    [7, 82],
    [5, '.'],
    [9, 83],
    [10, 84],
    [2, '[0-9]'],
    [2, '[^0-9]'],
    [3, 11, 3],
    [0, '%start', 86],
    [3, 87, 88],
    [0, '%EOF', 5],
    [4, 89, 7, 87],
    [0, '%Query', 90],
    [4, 91, 92, 93],
    [8, 94],
    [0, '%Term', 95],
    [6, 96],
    [0, '%Whitespace', 19],
    [4, 97, 98],
    [4, 99, 94, 92],
    [8, 100],
    [3, 101, 102, 103],
    [8, 104],
    [0, '%MatchMode', 28],
    [0, '%Subquery', 105],
    [0, '%Pair', 106],
    [0, '%Keyword', 107],
    [4, 94, 108],
    [4, 35, 89, 36],
    [4, 109, 38, 110, 111],
    [0, '%String', 112],
    [0, '%Connective', 42],
    [0, '%BareWord', 43],
    [8, 113],
    [0, '%Attribute', 114],
    [3, 115, 116, 109],
    [0, '%Operator', 52],
    [0, '%AnyValue', 117],
    [0, '%DoubleQuotedString', 54],
    [0, '%SingleQuotedString', 55],
    [3, 118, 119, 107],
    [0, '%Date', 120],
    [0, '%Numeric', 121],
    [4, 71, 122],
    [3, 123, 124],
    [0, '%QuotedString', 125],
    [0, '%Float', 76],
    [0, '%Integer', 126],
    [3, 115, 116],
    [4, 78, 127],
    [10, 128],
    [3, 11, 87],
  ],
  nameToUID: {
    start: 1,
    EOF: 3,
    Query: 6,
    Term: 14,
    Whitespace: 16,
    MatchMode: 23,
    Subquery: 24,
    Pair: 25,
    Keyword: 26,
    String: 31,
    Connective: 32,
    BareWord: 37,
    Attribute: 40,
    Operator: 44,
    AnyValue: 45,
    DoubleQuotedString: 46,
    SingleQuotedString: 47,
    Date: 61,
    Numeric: 62,
    QuotedString: 72,
    Float: 73,
    Integer: 74,
    '%start': 85,
    '%EOF': 87,
    '%Query': 89,
    '%Term': 92,
    '%Whitespace': 94,
    '%MatchMode': 100,
    '%Subquery': 101,
    '%Pair': 102,
    '%Keyword': 103,
    '%String': 107,
    '%Connective': 108,
    '%BareWord': 109,
    '%Attribute': 111,
    '%Operator': 113,
    '%AnyValue': 114,
    '%DoubleQuotedString': 115,
    '%SingleQuotedString': 116,
    '%Date': 118,
    '%Numeric': 119,
    '%QuotedString': 122,
    '%Float': 123,
    '%Integer': 124,
  },
};

const NAME = 0;
const DOT = 1;
const CHARACTER_CLASS = 2;
const ORDERED_CHOICE = 3;
const SEQUENCE = 4;
const STRING_LITERAL = 5;
const ZERO_OR_MORE = 6;
const ONE_OR_MORE = 7;
const OPTIONAL = 8;
const NEGATIVE_LOOK_AHEAD = 9;
const POSITIVE_LOOK_AHEAD = 10;
const ERROR_NAME = 11;
const ERROR_CHOICE = 12;

const OPERATOR_TO_TOKEN = {
  '<': 'lt',
  '<=': 'lte',
  '>': 'gt',
  '>=': 'gte',
};

const TOKEN_TO_OPERATOR = {
  lt: '<',
  lte: '<=',
  gt: '>',
  gte: '>=',
  eq: '',
  neq: '',
};

const NOT_TOKEN = {
  gt: 'lt',
  lt: 'gt',
  eq: 'neq',
  neq: 'eq',
  gte: 'lte',
  lte: 'gte',
};

class Parser {
  static parse(input: string, name?: string) {
    let node = new SyntaxNode('#document', input, 0, 0);
    let table = compiledGrammar.table;
    let nameToUID = compiledGrammar.nameToUID;

    name = name || 'start';

    // This is a stupid check.
    if (compiledGrammar.nameToUID['EOF'] !== undefined) table[0] = [SEQUENCE, nameToUID[name], nameToUID['EOF']];

    if (!this.evaluate(new Context(input, table), node, table, 0)) {
      // This is a stupid check.
      if (compiledGrammar.nameToUID['EOF'] !== undefined)
        table[0] = [SEQUENCE, nameToUID['%' + name], nameToUID['EOF']];

      node.children.length = 0;
      this.evaluate(new Context(input, table), node, table, 0);
      node.traverse({
        traverseTextNodes: false,
        enteredNode: function(node) {
          if (node.error) console.log(node.message() + '\n');
        },
      });
    }

    return node;
  }

  static evaluate(context, parent, rules, rule_id) {
    let rule = rules[rule_id],
      type = rule[0],
      input_length = context.input.length,
      memos = context.memos[rule_id];

    let uid = context.position,
      entry = memos[uid];

    if (entry === false) return false;
    else if (entry === true) return true;
    else if (entry) {
      if (parent) parent.children.push(entry.node);
      context.position = entry.position;
      return true;
    }

    let position = 0;
    let childCount = 0;
    switch (type) {
      case NAME:
      case ERROR_NAME:
        let node = new SyntaxNode(rule[1], context.input, context.position, 0, rule[3]);
        if (!this.evaluate(context, node, rules, rule[2])) {
          memos[uid] = false;
          return false;
        }
        node.range.length = context.position - node.range.location;
        memos[uid] = { node: node, position: context.position };

        if (parent) parent.children.push(node);
        return true;

      case CHARACTER_CLASS:
        let character = context.input.charAt(context.position);
        if (typeof rule[1].valueOf() === 'string') rule[1] = new RegExp(rule[1], 'g');
        if (character.match(rule[1])) {
          if (parent) parent.children.push(character);
          ++context.position;
          return true;
        }
        memos[uid] = false;
        return false;

      case SEQUENCE:
        for (let index = 1; index < rule.length; ++index)
          if (!this.evaluate(context, parent, rules, rule[index])) {
            memos[uid] = false;
            return false;
          }
        return true;

      case ORDERED_CHOICE:
      case ERROR_CHOICE:
        position = context.position;
        for (let index = 1; index < rule.length; ++index) {
          // cache opportunity here.
          let child_count = parent && parent.children.length;
          if (this.evaluate(context, parent, rules, rule[index])) return true;
          if (parent) parent.children.length = child_count;
          context.position = position;
        }
        memos[uid] = false;
        return false;

      case STRING_LITERAL:
        let string = rule[1];
        let string_length = string.length;

        if (string_length + context.position > input_length) {
          memos[uid] = false;
          return false;
        }

        for (let index = 0; index < string_length; ++context.position, ++index)
          if (context.input.charCodeAt(context.position) !== string.charCodeAt(index)) {
            context.position -= index;
            memos[uid] = false;
            return false;
          }
        if (parent) parent.children.push(string);
        return true;

      case DOT:
        if (context.position < input_length) {
          if (parent) parent.children.push(context.input.charAt(context.position));
          ++context.position;
          return true;
        }
        memos[uid] = false;
        return false;

      case POSITIVE_LOOK_AHEAD:
      case NEGATIVE_LOOK_AHEAD:
        position = context.position;
        memos[uid] = this.evaluate(context, null, rules, rule[1]) === (type === POSITIVE_LOOK_AHEAD);
        context.position = position;
        return memos[uid];

      case ZERO_OR_MORE:
        position = context.position;
        childCount = parent && parent.children.length;
        while (this.evaluate(context, parent, rules, rule[1])) {
          position = context.position;
          childCount = parent && parent.children.length;
        }
        context.position = position;
        if (parent) parent.children.length = childCount;
        return true;
      case ONE_OR_MORE:
        position = context.position;
        childCount = parent && parent.children.length;
        if (!this.evaluate(context, parent, rules, rule[1])) {
          memos[uid] = false;
          context.position = position;
          if (parent) parent.children.length = position;
          return false;
        }
        (position = context.position), (childCount = parent && parent.children.length);
        while (this.evaluate(context, parent, rules, rule[1])) {
          position = context.position;
          childCount = parent && parent.children.length;
        }
        context.position = position;
        if (parent) parent.children.length = childCount;
        return true;

      case OPTIONAL:
        position = context.position;
        childCount = parent && parent.children.length;
        if (!this.evaluate(context, parent, rules, rule[1])) {
          context.position = position;

          if (parent) parent.children.length = childCount;
        }
        return true;
    }
  }
}

class Context {
  position: number;
  input: any;
  memos: any[];

  constructor(input, table) {
    this.position = 0;
    this.input = input;
    this.memos = [];
    for (let i = 0; i < table.length; ++i) this.memos[i] = [];
  }
}

class SyntaxNode {
  name: any;
  source: any;
  range: { location: any; length: any };
  children: any[];
  error?: string;

  constructor(aName: string, aSource: string, aLocation: number, aLength: number, anErrorMessage?: string) {
    this.name = aName;
    this.source = aSource;
    this.range = { location: aLocation, length: aLength };
    this.children = [];
    this.error = anErrorMessage;
  }

  message() {
    let source = this.source,
      lineNumber = 1,
      index = 0,
      start = 0,
      length = source.length,
      range = this.range;

    for (; index < range.location; ++index)
      if (source.charAt(index) === '\n') {
        ++lineNumber;
        start = index + 1;
      }

    for (; index < length; ++index) if (source.charAt(index) === '\n') break;

    let line = source.substring(start, index);
    let message = line + '\n';
    message += new Array(this.range.location - start + 1).join(' ');
    message += new Array(Math.min(range.length, line.length) + 1).join('^') + '\n';
    message += 'ERROR line ' + lineNumber + ': ' + this.error;

    return message;
  }

  toString(spaces: string) {
    if (!spaces) spaces = '';

    let string = spaces + this.name + ' <' + this.innerText() + '> ',
      children = this.children,
      index = 0,
      count = children.length;

    for (; index < count; ++index) {
      let child = children[index];

      if (typeof child === 'string') string += '\n' + spaces + '\t' + child;
      else string += '\n' + children[index].toString(spaces + '\t');
    }

    return string;
  }

  innerText() {
    let range = this.range;

    return this.source.substr(range.location, range.length);
  }

  traverse(walker) {
    if (!walker.enteredNode || walker.enteredNode(this) !== false) {
      let children = this.children,
        index = 0,
        count = children && children.length;

      for (; index < count; ++index) {
        let child = children[index];

        if (typeof child !== 'string') child.traverse(walker);
        else if (walker.traversesTextNodes) {
          walker.enteredNode(child);

          if (walker.exitedNode) walker.exitedNode(child);
        }
      }
    }

    if (walker.exitedNode) walker.exitedNode(this);
  }
}

export class SearchQueryParser {
  static pad(val) {
    val = `${val}`;
    if (val.length === 1) {
      val = `0${val}`;
    }
    return val;
  }

  static parse(input) {
    const tree = Parser.parse(input.trim());
    if (tree.children.length < 1) {
      throw new Error('Invalid search query syntax!');
    }
    let result = this.transform(tree);
    return result;
  }

  static build(tokens) {
    const results = (() => {
      const result = [];
      for (let [key, operator, value] of Array.from(tokens) as any) {
        let component = `${TOKEN_TO_OPERATOR[operator]}${this.format(value)}`;
        if (key !== 'default') {
          component = `${key}:${component}`;
        }
        if (operator === 'neq') {
          component = `-${component}`;
        }
        // @ts-ignore
        result.push(component);
      }
      return result;
    })();

    return results.join(' ');
  }

  static format(value) {
    if (value instanceof Date) {
      return `${value.getUTCFullYear()}-${this.pad(value.getUTCMonth() + 1)}-${this.pad(value.getUTCDate())}`;
    }

    if (value.indexOf != null && value.indexOf(' ') !== -1) {
      const startChar = value.slice(0, 1);
      const endChar = value.slice(-1);
      if (startChar === endChar && ['"', "'"].includes(startChar)) {
        const coreValue = value.slice(1, -1);
        return startChar + coreValue.replace(/#{startChar}/, '\\' + startChar) + startChar;
      } else {
        return '"' + value.replace(/"/g, '"') + '"';
      }
    } else {
      return value;
    }
  }

  static replaceAll(str, searchStr, replaceStr) {
    while (str.includes(searchStr)) {
      str = str.replace(searchStr, replaceStr);
    }
    return str;
  }

  static transform(node, not = false) {
    if (node.error) {
      throw new Error(node.message());
    }

    switch (node.name) {
      case '#document':
        return this.transform(node.children[0]);
      case 'start':
        if (node.children.length > 1) {
          return this.transform(node.children[0]);
        } else {
          return [];
        }
      case 'Query':
        let elems = node.children.filter(c => c.name !== 'Whitespace').reverse();
        let current = this.transform(elems.pop());
        while (true) {
          let b, op;
          const next = elems.pop();
          if (!next) {
            break;
          }
          if (next.name === 'Connective') {
            op = next.innerText() === 'AND' ? 'and' : 'or';
            b = elems.pop();
          } else {
            op = 'and';
            b = next;
          }
          current = { [op]: [current, this.transform(b)] };
        }
        return current;
      case 'Term':
        let [c0, c1] = Array.from(node.children);
        if (c0.name === 'MatchMode') {
          if (c0.innerText() === '-' || c0.innerText() === 'NOT') {
            return this.transform(c1, true);
          } else {
            return this.transform(c1);
          }
        } else {
          return this.transform(c0);
        }
      case 'Subquery':
        return this.transform(node.children[1]);
      case 'Keyword':
        return { [this.transform(node.children[0])]: { is: not ? false : true } };
      case 'Pair':
        let [field, operator, attr] = Array.from(node.children);
        let opToken: string;
        if (!attr) {
          attr = operator;
          opToken = not ? NOT_TOKEN['eq'] : 'eq';
        } else {
          opToken = not ? NOT_TOKEN[OPERATOR_TO_TOKEN[operator.innerText()]] : OPERATOR_TO_TOKEN[operator.innerText()];
        }
        let transformedValue = this.transform(attr);
        if (typeof transformedValue == 'string') {
          if (transformedValue === '*') {
            opToken = not ? 'isNot' : 'is';
            transformedValue = null;
          } else if (transformedValue.includes('*')) {
            opToken = not ? 'notLike' : 'like';
            transformedValue = this.replaceAll(transformedValue, '*', '%');
            transformedValue = this.replaceAll(transformedValue, '%%', '%');
          }
        }
        return { [this.transform(field)]: { [opToken]: transformedValue } };
      case 'Attribute':
        return this.transform(node.children[0]);
      case 'AnyValue':
        return this.transform(node.children[0]);
      case 'BareWord':
        return node.innerText();
      case 'String':
        return this.transform(node.children[0]);
      case 'SingleQuotedString':
      case 'DoubleQuotedString':
        let word = node.innerText().slice(1, -1);
        return word;
      case 'Numeric':
        return this.transform(node.children[0]);
      case 'Integer':
        return parseInt(node.innerText(), 10);
      case 'Float':
        return parseFloat(node.innerText());
      case 'QuotedString':
        return this.transform(node.children[0]);
      case 'Date':
        return new Date(this.transform(node.children[1]));
      case undefined:
        return node;
      default:
        return node.name;
    }
  }
}
