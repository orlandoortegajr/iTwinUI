/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';
import { Popover, mergeRefs } from '../utils/index.js';
import type {
  CommonProps,
  PopoverProps,
  PopoverInstance,
} from '../utils/index.js';
import { Menu } from '../Menu/index.js';

export type DropdownMenuProps = {
  /**
   * List of menu items. Recommended to use MenuItem component.
   * You can pass function that takes argument `close` that closes the dropdown menu, or a list of MenuItems.
   */
  menuItems: (close: () => void) => JSX.Element[] | JSX.Element[] | JSX.Element;
  /**
   * ARIA role. Role of menu. For menu use 'menu', for select use 'listbox'.
   * @default 'menu'
   */
  role?: string;
  /**
   * Child element to wrap dropdown with.
   */
  children: React.ReactNode;
} & Omit<PopoverProps, 'content'> &
  Omit<CommonProps, 'title'>;

/**
 * Dropdown menu component.
 * Uses the {@link Popover} component, which is a wrapper around [tippy.js](https://atomiks.github.io/tippyjs).
 * @example
 * const menuItems = (close: () => void) => [
 *   <MenuItem key={1} onClick={onClick(1, close)}>
 *     Item #1
 *   </MenuItem>,
 *   <MenuItem key={2} onClick={onClick(2, close)}>
 *     Item #2
 *   </MenuItem>,
 *   <MenuItem key={3} onClick={onClick(3, close)}>
 *     Item #3
 *   </MenuItem>,
 * ];
 * <DropdownMenu menuItems={menuItems}>
 *   <Button>Menu</Button>
 * </DropdownMenu>
 */
export const DropdownMenu = (props: DropdownMenuProps) => {
  const {
    menuItems,
    children,
    className,
    style,
    role = 'menu',
    visible,
    placement = 'bottom-start',
    onShow,
    onHide,
    trigger,
    id,
    ...rest
  } = props;

  const [isVisible, setIsVisible] = React.useState(visible ?? false);
  React.useEffect(() => {
    setIsVisible(visible ?? false);
  }, [visible]);

  const open = React.useCallback(() => setIsVisible(true), []);
  const close = React.useCallback(() => setIsVisible(false), []);

  const menuContent = React.useMemo(() => {
    if (typeof menuItems === 'function') {
      return menuItems(close);
    }
    return menuItems;
  }, [menuItems, close]);

  const targetRef = React.useRef<HTMLElement>(null);

  const onShowHandler = React.useCallback(
    (instance: PopoverInstance) => {
      setIsVisible(true);
      onShow?.(instance);
    },
    [onShow],
  );

  const onHideHandler = React.useCallback(
    (instance: PopoverInstance) => {
      setIsVisible(false);
      targetRef.current?.focus();
      onHide?.(instance);
    },
    [onHide],
  );

  return (
    <Popover
      content={
        <Menu className={className} style={style} role={role} id={id}>
          {menuContent}
        </Menu>
      }
      visible={trigger === undefined ? isVisible : undefined}
      onClickOutside={close}
      placement={placement}
      onShow={onShowHandler}
      onHide={onHideHandler}
      trigger={visible === undefined ? trigger : undefined}
      {...rest}
    >
      {React.isValidElement(children) ? (
        React.cloneElement(children as JSX.Element, {
          ref: mergeRefs(
            targetRef,
            (props.children as React.FunctionComponentElement<HTMLElement>).ref,
          ),
          onClick: (args: unknown) => {
            trigger === undefined && (isVisible ? close() : open());
            (children as JSX.Element).props.onClick?.(args);
          },
        })
      ) : (
        <></>
      )}
    </Popover>
  );
};

export default DropdownMenu;
