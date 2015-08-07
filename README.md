# CTemplate
-----------------

< 1KB lightweight, fast & powerful JavaScript templating engine with zero dependencies. Compatible with server-side environments like node.js, module loaders like RequireJS and all web browsers.
It was inspired by the "trimpath" engine but this engine was twice as fast for parsing and ~10% faster in processing in my tests. It may be used as a replacement for trimpath. I used it in some environments like [Galaxytrek](http://galaxytrek.com) and it's board-software.

## Expressions and Expression Modifiers
```
  ${expr}
  ${expr|modifier}
  ${expr|modifier1|modifier2|...|modifierN}
  ${expr|modifier1:argExpr1_1}
  ${expr|modifier1:argExpr1_1,argExpr1_2,...,argExpr1_N}
  ${expr|modifier1:argExpr1_1,argExpr1_2|...|modifierN:argExprN_1,argExprN_2,...,argExprN_M}

  Examples:
  ${customer.firstName}
  ${customer.firstName|capitalize}
  ${(customer.fullName|String.toLowerCase|String.split:' ')[0]}
```

### Control Flow
```
  {if testExpr} 
    {elseif testExpr}
    {else}
  {/if}

  Examples:
  {if customer != null && customer.balance > 1000}
    We love you!
  {/if}

  {if customer.balance < 0}
      Please make payment of ${customer.balance|Math.abs} coins
  {elseif customer.balance == 0}
      There is nothing to pay.
  {else}      
      Your balance: ${customer.balance}
  {/if}

  <a href="/login{if returnURL != null}?goto=${returnURL}{/if}">Login</a>
```

### Loops
```
  {for varName in listExpr}
  {/for}

  {for varName in listExpr}
    ...main body of the loop...
  {forelse}
    ...body when listExpr is null or listExpr.length is 0...
  {/for}
```

```
  Two variables are bound in the main body of the loop:
    __LIST__varName - holds the result of evaluating listExpr.
    varName_index   - this is the key or counter used during iteration.

  Examples:
  {for x in customer.getRecentOrders()}
    ${x_index} : ${x.orderNumber} <br/>
  {forelse}
    You have no recent orders.
  {/for}

  Converted pseudo-code for the above...
  var __LIST__x = customer.getRecentOrders();
  if (__LIST__x != null && __LIST__x.length > 0) {
    for (var x_index in __LIST__x) {
      var x = __LIST__x[x_index];
      ${x_index} : {$x.orderNumber} <br/>
    }
  } else {
    You have no recent orders.
  }
```

### Variable Declarations
```
  {var varName}
  {var varName = varInitExpr}

  Examples:
  {var temp = crypto.generateRandomPrime(4096)}
  Your prime is ${temp}.  
```

### Macro Declarations
```
  {macro macroName(arg1, arg2, ...argN)}
    ...body of the macro...
  {/macro}

  Examples:
  {macro htmlList(list, optionalListType)}
    {var listType = optionalListType != null ? optionalListType : "ul"}
    <${listType}>
      {for item in list}     
        <li>${item}</li>
      {/for}
    </${listType}>
  {/macro}

  Using the macro...
  ${htmlList([ 1, 2, 3])}
  ${htmlList([ "Purple State", "Blue State", "Red State" ], "ol")}
  {var saved = htmlList([ 100, 200, 300 ])}
  ${saved} and ${saved}
```

### In-line JavaScript

#### eval blocks
```
  {eval}
    ...javascript evaluated during JST processing...
  {/eval
```

## License
The No-Looki-License (NLL)

Copyright (c) 2015 Denys Bogatz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
"looki Deutschland GmbH", affiliated companies and partners are not allowed
to benefit from this software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
