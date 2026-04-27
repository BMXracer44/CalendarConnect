Compiled with problems:
×
ERROR in ./src/pages/Calendar.jsx
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: C:\Users\Stray\CalendarConnect\frontend\src\pages\Calendar.jsx: Unexpected token, expected "..." (80:48)

  78 |         selectable={true}
  79 |
> 80 |         events={events}   {/* 🔥 NOW FROM API */}
     |                                                 ^
  81 |
  82 |         dateClick={handleDateClick}
  83 |       />
    at constructor (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:365:19)
    at FlowParserMixin.raise (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:6599:19)
    at FlowParserMixin.unexpected (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:6619:16)
    at FlowParserMixin.expect (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:6899:12)
    at FlowParserMixin.jsxParseAttribute (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:4645:12)
    at FlowParserMixin.jsxParseOpeningElementAfterName (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:4667:28)
    at FlowParserMixin.jsxParseOpeningElementAfterName (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:4068:18)
    at FlowParserMixin.jsxParseOpeningElementAt (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:4662:17)
    at FlowParserMixin.jsxParseElementAt (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:4686:33)
    at FlowParserMixin.jsxParseElementAt (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:4698:32)
    at FlowParserMixin.jsxParseElement (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:4749:17)
    at FlowParserMixin.parseExprAtom (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:4759:19)
    at FlowParserMixin.parseExprSubscripts (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:11081:23)
    at FlowParserMixin.parseUpdate (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:11066:21)
    at FlowParserMixin.parseMaybeUnary (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:11046:23)
    at FlowParserMixin.parseMaybeUnaryOrPrivate (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10899:61)
    at FlowParserMixin.parseExprOps (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10904:23)
    at FlowParserMixin.parseMaybeConditional (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10881:23)
    at FlowParserMixin.parseMaybeAssign (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10831:21)
    at C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:3498:39
    at FlowParserMixin.tryParse (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:6907:20)
    at FlowParserMixin.parseMaybeAssign (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:3498:18)
    at C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10800:39
    at FlowParserMixin.allowInAnd (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:12426:12)
    at FlowParserMixin.parseMaybeAssignAllowIn (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10800:17)
    at FlowParserMixin.parseMaybeAssignAllowInOrVoidPattern (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:12493:17)
    at FlowParserMixin.parseParenAndDistinguishExpression (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:11675:28)
    at FlowParserMixin.parseParenAndDistinguishExpression (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:3591:18)
    at FlowParserMixin.parseExprAtom (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:11331:23)
    at FlowParserMixin.parseExprAtom (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:4764:20)
    at FlowParserMixin.parseExprSubscripts (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:11081:23)
    at FlowParserMixin.parseUpdate (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:11066:21)
    at FlowParserMixin.parseMaybeUnary (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:11046:23)
    at FlowParserMixin.parseMaybeUnaryOrPrivate (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10899:61)
    at FlowParserMixin.parseExprOps (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10904:23)
    at FlowParserMixin.parseMaybeConditional (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10881:23)
    at FlowParserMixin.parseMaybeAssign (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10831:21)
    at FlowParserMixin.parseMaybeAssign (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:3549:18)
    at FlowParserMixin.parseExpressionBase (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10784:23)
    at C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10780:39
    at FlowParserMixin.allowInAnd (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:12421:16)
    at FlowParserMixin.parseExpression (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:10780:17)
    at FlowParserMixin.parseReturnStatement (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:13142:28)
    at FlowParserMixin.parseStatementContent (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:12798:21)
    at FlowParserMixin.parseStatementLike (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:12767:17)
    at FlowParserMixin.parseStatementLike (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:2918:24)
    at FlowParserMixin.parseStatementListItem (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:12747:17)
    at FlowParserMixin.parseBlockOrModuleBlockBody (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:13316:61)
    at FlowParserMixin.parseBlockBody (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:13309:10)
    at FlowParserMixin.parseBlock (C:\Users\Stray\CalendarConnect\frontend\node_modules\@babel\parser\lib\index.js:13297:10)