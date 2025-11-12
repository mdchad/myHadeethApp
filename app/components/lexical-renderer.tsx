import React from "react";
import { View, Text } from "react-native";
import { camelCase } from "es-toolkit";

interface LexicalRendererProps {
  serializedState: any;
  className?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
  footnoteRefs?: React.RefObject<Record<string, any>>;
  hadithId?: string;
}

// Helper to build className strings
const buildClassName = (...classes: (string | false | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// JSX Renderer for Lexical serialized state
const renderSerializedToJSX = (
  serializedState: any,
  footnoteRefs?: React.RefObject<Record<string, any>>,
  hadithId?: string,
  pClassName?: string
) => {
  if (!serializedState?.root) return null;
  return renderNode(serializedState.root, Math.random(), footnoteRefs, hadithId, pClassName);
};

const renderNode = (
  node: any,
  key: React.Key = Math.random(),
  footnoteRefs?: React.RefObject<Record<string, any>>,
  hadithId?: string,
  pClassName?: string
): React.ReactNode => {
  // Handle root node
  if (node.type === 'root') {
    return (
      <View key={key}>
        {node.children?.map((child: any, index: number) =>
          renderNode(child, index, footnoteRefs, hadithId, pClassName)
        )}
      </View>
    );
  }

  // Handle text nodes
  if (node.type === 'text') {
    let content: React.ReactNode = node.text || '';
    const classNames: string[] = [];
    const inlineStyle: any = {};

    // Parse inline styles for colors, font-size, etc that can't be in Tailwind
    if (node.style) {
      node.style.split(';').forEach((style: string) => {
        const [property, value] = style.split(':');
        if (property && value) {
          const camelProp = camelCase(property.trim());
          const trimmedValue = value.trim();

          // Handle specific styles
          switch (camelProp) {
            case 'color':
              inlineStyle.color = trimmedValue;
              break;
            case 'fontSize':
              inlineStyle.fontSize = parseInt(trimmedValue);
              break;
            case 'fontWeight':
              inlineStyle.fontWeight = trimmedValue;
              break;
            case 'fontStyle':
              inlineStyle.fontStyle = trimmedValue;
              break;
            case 'textDecorationLine':
              inlineStyle.textDecorationLine = trimmedValue;
              break;
            default:
              inlineStyle[camelProp] = trimmedValue;
          }
        }
      });
    }

    // Apply formatting based on format bitmask
    if (node.format) {
      if (node.format & 1) classNames.push('font-bold'); // bold
      if (node.format & 2) classNames.push('italic'); // italic
      if (node.format & 4) classNames.push('line-through'); // strikethrough
      if (node.format & 8) classNames.push('underline'); // underline
      if (node.format & 16) classNames.push('font-mono bg-gray-100 px-1'); // code
      if (node.format & 32) classNames.push('text-xs'); // subscript (approximation)
      if (node.format & 64) {
        // Handle superscript with potential footnote refs
        const textContent = typeof content === 'string' ? content : node.text || '';
        const footnoteMatch = textContent.match(/\[(\d+)\]/);

        if (footnoteMatch && footnoteRefs?.current && hadithId) {
          const footnoteNumber = footnoteMatch[1];
          const refKey = `${hadithId}-${footnoteNumber}`;

          return (
            <Text
              key={key}
              className={buildClassName(...classNames, 'text-xs')}
              style={Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined}
              ref={(el) => {
                if (el && footnoteRefs.current) {
                  footnoteRefs.current[refKey] = el;
                }
              }}
            >
              {content}
            </Text>
          );
        } else {
          classNames.push('text-xs'); // regular superscript
        }
      }
      if (node.format & 128) { // highlight
        classNames.push('bg-yellow-200');
      }
    }

    return (
      <Text
        key={key}
        className={classNames.length > 0 ? classNames.join(' ') : undefined}
        style={Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined}
      >
        {content}
      </Text>
    );
  }

  // Handle element nodes
  const children = node.children?.map((child: any, index: number) =>
    renderNode(child, `${key}-${index}`, footnoteRefs, hadithId)
  ) || [];

  switch (node.type) {
    case 'paragraph':
      const pClasses: string[] = ['mb-4', pClassName as string];
      const pStyle: any = {};

      // textAlign works directly on Text in React Native
      if (node.format && node.format !== 'left') {
        pStyle.textAlign = node.format;
      }

      if (node.indent && node.indent > 0) {
        // Use style for dynamic indent since Tailwind can't do arbitrary values in RN
        pStyle.marginLeft = node.indent * 20;
      }
      if (node.direction) {
        pStyle.writingDirection = node.direction;
      }

      return (
        <Text
          key={key}
          className={pClasses.join(' ')}
          style={Object.keys(pStyle).length > 0 ? pStyle : undefined}
        >
          {children}
        </Text>
      );

    case 'heading':
      const headingLevel = Math.min(Math.max(node.tag || 1, 1), 6);
      const headingSizeClasses: Record<number, string> = {
        1: 'text-4xl font-bold',
        2: 'text-3xl font-bold',
        3: 'text-2xl font-bold',
        4: 'text-xl font-bold',
        5: 'text-lg font-bold',
        6: 'text-base font-bold',
      };

      return (
        <View key={key} className="mb-4">
          <Text className={headingSizeClasses[headingLevel]}>{children}</Text>
        </View>
      );

    case 'table':
      return (
        <View key={key} className="border border-gray-300 mb-4">
          {children}
        </View>
      );

    case 'tablerow':
      return (
        <View key={key} className="flex-row border-b border-gray-300">
          {children}
        </View>
      );

    case 'tablecell':
      return (
        <View key={key} className="flex-1 border-r border-gray-300 p-2">
          <Text>{children}</Text>
        </View>
      );

    case 'code':
      return (
        <View key={key} className="bg-gray-100 p-4 rounded mb-4">
          <Text className="font-mono">
            {node.children?.[0]?.text || children}
          </Text>
        </View>
      );

    case 'quote':
      return (
        <View key={key} className="border-l-4 border-gray-300 pl-4 my-4">
          <Text className="italic">{children}</Text>
        </View>
      );

    case 'list':
      const listClass = node.listType === 'number' ? 'mb-4' : 'mb-4';
      return (
        <View key={key} className={listClass}>
          {children}
        </View>
      );

    case 'listitem':
      const bullet = node.listType === 'number' ? `${node.value || 1}. ` : '• ';
      return (
        <View key={key} className="mb-1">
          <Text className="leading-6">
            {bullet}
            {children}
          </Text>
        </View>
      );

    case 'hadith-number':
      return (
        <View key={key} className="mb-2">
          <Text className="font-bold text-lg">
            {node.number || children}
          </Text>
        </View>
      );

    case 'prophet-quote':
      return (
        <View key={key} className="border-l-4 border-green-500 pl-4 bg-green-50 my-4 p-2">
          <Text>{children}</Text>
        </View>
      );

    case 'narrator-chain':
      return (
        <View key={key} className="mb-3">
          <Text className="text-gray-700 italic">{children}</Text>
        </View>
      );

    case 'columns':
      return (
        <View key={key} className="flex-row gap-4 mb-4">
          {children}
        </View>
      );

    case 'column':
      return (
        <View key={key} className="flex-1">
          {children}
        </View>
      );

    case 'linebreak':
      return <Text key={key}>{'\n'}</Text>;

    default:
      return (
        <View key={key} className="mb-2">
          {children}
        </View>
      );
  }
};

export default function LexicalRenderer({
  serializedState,
  className = "",
  lang,
  dir,
  footnoteRefs,
  hadithId
}: LexicalRendererProps) {
  if (!serializedState) {
    return null;
  }

  const containerStyle = dir ? { writingDirection: dir } : undefined;

  return (
    <View className={className} style={containerStyle}>
      {renderSerializedToJSX(serializedState, footnoteRefs, hadithId, className)}
    </View>
  );
}

// Export the render functions for backward compatibility
export { renderSerializedToJSX, renderNode };
