/**
 * SOURCE IS MODIFIED FROM MATERIAL-UI'S AUTOCOMPLETE
 * SEE https://github.com/callemall/material-ui
 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import keycode from 'keycode';
import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Popover from 'material-ui/Popover/Popover';
import propTypes from 'material-ui/utils/propTypes';
import warning from 'warning';
import deprecated from 'material-ui/utils/deprecatedPropType';

import { observer } from 'mobx-react';

function getStyles(props, context, state) {
  const {anchorEl} = state;
  const {fullWidth} = props;

  const styles = {
    root: {
      display: 'inline-block',
      position: 'relative',
      width: fullWidth ? '100%' : 256,
    },
    menu: {
      width: '100%',
    },
    list: {
      display: 'block',
      width: fullWidth ? '100%' : 256,
    },
    innerDiv: {
      overflow: 'hidden',
    },
  };

  if (anchorEl && fullWidth) {
    styles.popover = {
      width: anchorEl.clientWidth,
    };
  }

  return styles;
}

@observer
class AutoComplete extends Component {
  static propTypes = {
    /**
     * Location of the anchor for the auto complete.
     */
    anchorOrigin: propTypes.origin,
    /**
     * If true, the auto complete is animated as it is toggled.
     */
    animated: PropTypes.bool,
    /**
     * Array of strings or nodes used to populate the list.
     */
    dataSource: PropTypes.array.isRequired,
    /**
     * Disables focus ripple when true.
     */
    disableFocusRipple: PropTypes.bool,
    /**
     * Override style prop for error.
     */
    errorStyle: PropTypes.object,
    /**
     * The error content to display.
     */
    errorText: PropTypes.node,
    /**
     * Callback function used to filter the auto complete.
     *
     * @param {string} searchText The text to search for within `dataSource`.
     * @param {string} key `dataSource` element, or `text` property on that element if it's not a string.
     * @returns {boolean} `true` indicates the auto complete list will include `key` when the input is `searchText`.
     */
    filter: PropTypes.func,
    /**
     * The content to use for adding floating label element.
     */
    floatingLabelText: PropTypes.node,
    /**
     * If true, the field receives the property `width: 100%`.
     */
    fullWidth: PropTypes.bool,
    /**
     * The hint content to display.
     */
    hintText: PropTypes.node,
    /**
     * Override style for list.
     */
    listStyle: PropTypes.object,
    /**
     * The max number of search results to be shown.
     * By default it shows all the items which matches filter.
     */
    maxSearchResults: PropTypes.number,
    /**
     * Delay for closing time of the menu.
     */
    menuCloseDelay: PropTypes.number,
    /**
     * Props to be passed to menu.
     */
    menuProps: PropTypes.object,
    /**
     * Override style for menu.
     */
    menuStyle: PropTypes.object,
    /**
     * Callback function that is fired when the `TextField` loses focus.
     *
     * @param {object} event `blur` event targeting the `TextField`.
     */
    onBlur: PropTypes.func,
    /**
     * Callback function that is fired when the `TextField` gains focus.
     *
     * @param {object} event `focus` event targeting the `TextField`.
     */
    onFocus: PropTypes.func,
    /**
     * Callback function that is fired when the `TextField` receives a keydown event.
     */
    onKeyDown: PropTypes.func,
    /**
     * Callback function that is fired when a list item is selected, or enter is pressed in the `TextField`.
     *
     * @param {string} chosenRequest Either the `TextField` input value, if enter is pressed in the `TextField`,
     * or the text value of the corresponding list item that was selected.
     * @param {number} index The index in `dataSource` of the list item selected, or `-1` if enter is pressed in the
     * `TextField`.
     */
    onNewRequest: PropTypes.func,
    /**
     * Callback function that is fired when the user updates the `TextField`.
     *
     * @param {string} searchText The auto-complete's `searchText` value.
     * @param {array} dataSource The auto-complete's `dataSource` array.
     */
    onUpdateInput: PropTypes.func,
    /**
     * Auto complete menu is open if true.
     */
    open: PropTypes.bool,
    /**
     * If true, the list item is showed when a focus event triggers.
     */
    openOnFocus: PropTypes.bool,
    /**
     * Text being input to auto complete.
     */
    searchText: PropTypes.string,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * Origin for location of target.
     */
    targetOrigin: propTypes.origin,
    /**
     * If true, will update when focus event triggers.
     */
    triggerUpdateOnFocus: deprecated(PropTypes.bool, 'Instead, use openOnFocus'),
  };

  static defaultProps = {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    animated: true,
    disableFocusRipple: true,
    filter: (searchText, key) => searchText !== '' && key.indexOf(searchText) !== -1,
    fullWidth: false,
    open: false,
    openOnFocus: false,
    onUpdateInput: () => {
    },
    onNewRequest: () => {
    },
    searchText: '',
    menuCloseDelay: 300,
    targetOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    anchorEl: null,
    focusTextField: true,
    open: false,
    searchText: undefined
  };

  componentWillMount() {
    this.requestsList = [];
    this.setState({
      open: this.props.open,
      searchText: this.props.searchText
    });
    this.timerTouchTapCloseId = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchText !== nextProps.searchText) {
      this.setState({
        searchText: nextProps.searchText,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timerTouchTapCloseId);
  }

  close() {
    this.setState({
      open: false,
      anchorEl: null,
    });
  }

  handleRequestClose = () => {
    // Only take into account the Popover clickAway when we are
    // not focusing the TextField.
    if (!this.state.focusTextField) {
      this.close();
    }
  };

  setValue(textValue) {
    warning(false, 'setValue() is deprecated, use the searchText property.');

    this.setState({
      searchText: textValue,
    });
  }

  getValue() {
    warning(false, 'getValue() is deprecated.');

    return this.state.searchText;
  }

  handleMouseDown = (event) => {
    // Keep the TextField focused
    event.preventDefault();
  };

  handleItemTouchTap = (event, child) => {
    const dataSource = this.props.dataSource;

    const index = parseInt(child.key, 10);
    const chosenRequest = dataSource[index];
    const searchText = typeof chosenRequest === 'string' ? chosenRequest : chosenRequest.text;

    this.props.onNewRequest(chosenRequest, index);

    this.timerTouchTapCloseId = setTimeout(() => {
      this.setState({
        searchText: searchText,
      });
      this.close();
      this.timerTouchTapCloseId = null;
    }, this.props.menuCloseDelay);
  };

  handleEscKeyDown = () => {
    this.close();
  };

  handleKeyDown = (event) => {
    if (this.props.onKeyDown) this.props.onKeyDown(event);

    switch (keycode(event)) {
      case 'enter':
        this.close();
        const searchText = this.state.searchText;
        if (searchText !== '') {
          this.props.onNewRequest(searchText, -1);
        }
        break;

      case 'esc':
        this.close();
        break;

      case 'down':
        event.preventDefault();
        this.setState({
          open: true,
          focusTextField: false,
          anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
        });
        break;

      default:
        break;
    }
  };

  handleChange = (event) => {
    const searchText = event.target.value;

    // Make sure that we have a new searchText.
    // Fix an issue with a Cordova Webview
    if (searchText === this.state.searchText) {
      return;
    }

    this.setState({
      searchText: searchText,
      open: true,
      anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
    }, () => {
      this.props.onUpdateInput(searchText, this.props.dataSource);
    });
  };

  handleBlur = (event) => {
    if (this.state.focusTextField && this.timerTouchTapCloseId === null) {
      this.close();
    }

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  handleFocus = (event) => {
    if (!this.state.open && (this.props.triggerUpdateOnFocus || this.props.openOnFocus)) {
      this.setState({
        open: true,
        anchorEl: ReactDOM.findDOMNode(this.refs.searchTextField),
      });
    }

    this.setState({
      focusTextField: true,
    });

    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  blur() {
    this.refs.searchTextField.blur();
  }

  focus() {
    this.refs.searchTextField.focus();
  }

  render() {
    const {
      anchorOrigin,
      animated,
      style,
      errorStyle,
      floatingLabelText,
      hintText,
      filter,
      fullWidth,
      menuStyle,
      menuProps,
      listStyle,
      targetOrigin,
      disableFocusRipple,
      triggerUpdateOnFocus, // eslint-disable-line no-unused-vars
      openOnFocus, // eslint-disable-line no-unused-vars
      maxSearchResults,
      dataSource,
      store,
      ...other,
    } = this.props;

    const {
      open,
      anchorEl,
      searchText,
      focusTextField,
    } = this.state;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);

    const requestsList = [];

    console.log(searchText);
    let cached = store._searchCache[store.selectedSemester] && store._searchCache[store.selectedSemester][searchText];
    if (cached && searchText) {
      console.log('from cache', cached);
      if (cached.length > 0)
        this.requestsList = cached;
    }
    else {
      dataSource.every((item, index) => {
        switch (typeof item) {
          case 'string':
            if (filter(searchText, item, item)) {
              requestsList.push({
                text: item,
                value: (
                  <MenuItem
                    innerDivStyle={styles.innerDiv}
                    value={item}
                    primaryText={item}
                    disableFocusRipple={disableFocusRipple}
                    key={index}
                  />),
              });
            }
            break;

          case 'object':
            if (item && typeof item.text === 'string') {
              if (filter(searchText, item.text, item)) {
                if (item.value.type && (item.value.type.muiName === MenuItem.muiName ||
                  item.value.type.muiName === Divider.muiName)) {
                  requestsList.push({
                    text: item.text,
                    value: React.cloneElement(item.value, {
                      key: index,
                      disableFocusRipple: disableFocusRipple,
                    }),
                  });
                } else {
                  requestsList.push({
                    text: item.text,
                    value: (
                      <MenuItem
                        innerDivStyle={styles.innerDiv}
                        primaryText={item.value}
                        disableFocusRipple={disableFocusRipple}
                        key={index}
                      />),
                  });
                }
              }
            }
            break;

          default:
          // Do nothing
        }

        return !(maxSearchResults && maxSearchResults > 0 && requestsList.length === maxSearchResults);
      });

      if (store._searchCache[store.selectedSemester])
        store._searchCache[store.selectedSemester][searchText] = requestsList;
      
      this.requestsList = requestsList;
    }

    const menu = open && requestsList.length > 0 && (
        <Menu
          {...menuProps}
          ref="menu"
          autoWidth={false}
          disableAutoFocus={focusTextField}
          onEscKeyDown={this.handleEscKeyDown}
          initiallyKeyboardFocused={true}
          onItemTouchTap={this.handleItemTouchTap}
          onMouseDown={this.handleMouseDown}
          style={Object.assign(styles.menu, menuStyle)}
          listStyle={Object.assign(styles.list, listStyle)}
        >
          {requestsList.map((i) => i.value)}
        </Menu>
      );

    return (
      <div style={prepareStyles(Object.assign(styles.root, style))}>
        <TextField
          {...other}
          ref="searchTextField"
          autoComplete="off"
          value={searchText}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyDown={this.handleKeyDown}
          floatingLabelText={floatingLabelText}
          hintText={hintText}
          fullWidth={fullWidth}
          multiLine={false}
          errorStyle={errorStyle}
        />
        <Popover
          style={styles.popover}
          canAutoPosition={false}
          anchorOrigin={anchorOrigin}
          targetOrigin={targetOrigin}
          open={open}
          anchorEl={anchorEl}
          useLayerForClickAway={false}
          onRequestClose={this.handleRequestClose}
          animated={animated}
        >
          {menu}
        </Popover>
      </div>
    );
  }
}

AutoComplete.levenshteinDistance = (searchText, key) => {
  const current = [];
  let prev;
  let value;

  for (let i = 0; i <= key.length; i++) {
    for (let j = 0; j <= searchText.length; j++) {
      if (i && j) {
        if (searchText.charAt(j - 1) === key.charAt(i - 1)) value = prev;
        else value = Math.min(current[j], current[j - 1], prev) + 1;
      } else {
        value = i + j;
      }
      prev = current[j];
      current[j] = value;
    }
  }
  return current.pop();
};

AutoComplete.noFilter = () => true;

AutoComplete.defaultFilter = AutoComplete.caseSensitiveFilter = (searchText, key) => {
  return searchText !== '' && key.indexOf(searchText) !== -1;
};

AutoComplete.caseInsensitiveFilter = (searchText, key) => {
  return key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
};

AutoComplete.levenshteinDistanceFilter = (distanceLessThan) => {
  if (distanceLessThan === undefined) {
    return AutoComplete.levenshteinDistance;
  } else if (typeof distanceLessThan !== 'number') {
    throw 'Error: AutoComplete.levenshteinDistanceFilter is a filter generator, not a filter!';
  }

  return (s, k) => AutoComplete.levenshteinDistance(s, k) < distanceLessThan;
};

AutoComplete.fuzzyFilter = (searchText, key) => {
  const compareString = key.toLowerCase();
  searchText = searchText.toLowerCase();

  let searchTextIndex = 0;
  for (let index = 0; index < key.length; index++) {
    if (compareString[index] === searchText[searchTextIndex]) {
      searchTextIndex += 1;
    }
  }

  return searchTextIndex === searchText.length;
};

AutoComplete.Item = MenuItem;
AutoComplete.Divider = Divider;

export default AutoComplete;