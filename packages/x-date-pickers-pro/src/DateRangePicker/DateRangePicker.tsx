import PropTypes from 'prop-types';
import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useLicenseVerifier } from '@mui/x-license-pro';
import {
  ResponsiveTooltipWrapper,
  ResponsiveWrapperProps,
  useDefaultDates,
  useUtils,
  ValidationProps,
  usePickerState,
  PickerStateValueManager,
  DateInputPropsLike,
} from '@mui/x-date-pickers/internals';
import { DateRangePickerView, ExportedDateRangePickerViewProps } from './DateRangePickerView';
import { DateRangePickerInput, ExportedDateRangePickerInputProps } from './DateRangePickerInput';
import { RangeInput, DateRange } from '../internal/models/dateRange';
import {
  useDateRangeValidation,
  DateRangeValidationError,
} from '../internal/hooks/validation/useDateRangeValidation';
import { parseRangeInputValue } from '../internal/utils/date-utils';
import { getReleaseInfo } from '../internal/utils/releaseInfo';

const releaseInfo = getReleaseInfo();

interface BaseDateRangePickerProps<TDate>
  extends ExportedDateRangePickerViewProps<TDate>,
    ValidationProps<DateRangeValidationError, RangeInput<TDate>>,
    ExportedDateRangePickerInputProps {
  /**
   * The components used for each slot.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  components?: ExportedDateRangePickerViewProps<TDate>['components'] &
    ExportedDateRangePickerInputProps['components'];
  /**
   * Text for end input label and toolbar placeholder.
   * @default 'End'
   */
  endText?: React.ReactNode;
  /**
   * Custom mask. Can be used to override generate from format. (e.g. `__/__/____ __:__` or `__/__/____ __:__ _M`).
   * @default '__/__/____'
   */
  mask?: ExportedDateRangePickerInputProps['mask'];
  /**
   * Min selectable date. @DateIOType
   * @default defaultMinDate
   */
  minDate?: TDate;
  /**
   * Max selectable date. @DateIOType
   * @default defaultMaxDate
   */
  maxDate?: TDate;
  /**
   * Callback fired when the value (the selected date range) changes @DateIOType.
   * @param {DateRange<TDate>} date The new parsed date range.
   * @param {string} keyboardInputValue The current value of the keyboard input.
   */
  onChange: (date: DateRange<TDate>, keyboardInputValue?: string) => void;
  /**
   * Text for start input label and toolbar placeholder.
   * @default 'Start'
   */
  startText?: React.ReactNode;
  /**
   * The value of the date range picker.
   */
  value: RangeInput<TDate>;
}

const KeyboardDateInputComponent = DateRangePickerInput as unknown as React.FC<DateInputPropsLike>;
const PureDateInputComponent = DateRangePickerInput as unknown as React.FC<DateInputPropsLike>;

const rangePickerValueManager: PickerStateValueManager<any, any> = {
  emptyValue: [null, null],
  parseInput: parseRangeInputValue,
  areValuesEqual: (utils, a, b) => utils.isEqual(a[0], b[0]) && utils.isEqual(a[1], b[1]),
};

export interface DateRangePickerProps<TDate>
  extends BaseDateRangePickerProps<TDate>,
    ResponsiveWrapperProps {}

type DateRangePickerComponent = (<TDate>(
  props: DateRangePickerProps<TDate> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element) & { propTypes?: any };

/**
 *
 * Demos:
 *
 * - [Date Range Picker](https://mui.com/components/x/react-date-pickers/date-range-picker/)
 *
 * API:
 *
 * - [DateRangePicker API](https://mui.com/api/date-range-picker/)
 */
export const DateRangePicker = React.forwardRef(function DateRangePicker<TDate>(
  inProps: DateRangePickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateRangePicker' });
  useLicenseVerifier('x-date-pickers-pro', releaseInfo);

  const {
    calendars = 2,
    value,
    onChange,
    mask = '__/__/____',
    startText = 'Start',
    endText = 'End',
    inputFormat: passedInputFormat,
    minDate: minDateProp,
    maxDate: maxDateProp,
    ...other
  } = props;

  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();
  const minDate = minDateProp ?? defaultDates.minDate;
  const maxDate = maxDateProp ?? defaultDates.maxDate;
  const [currentlySelectingRangeEnd, setCurrentlySelectingRangeEnd] = React.useState<
    'start' | 'end'
  >('start');

  const pickerStateProps = {
    ...other,
    value,
    onChange,
  };

  const restProps = {
    ...other,
    minDate,
    maxDate,
  };

  const { pickerProps, inputProps, wrapperProps } = usePickerState<
    RangeInput<TDate>,
    DateRange<TDate>
  >(pickerStateProps, rangePickerValueManager);

  const validationError = useDateRangeValidation(props);

  const DateInputProps = {
    ...inputProps,
    ...restProps,
    currentlySelectingRangeEnd,
    inputFormat: passedInputFormat || utils.formats.keyboardDate,
    setCurrentlySelectingRangeEnd,
    startText,
    endText,
    mask,
    validationError,
    ref,
  };

  return (
    <ResponsiveTooltipWrapper
      {...restProps}
      {...wrapperProps}
      DateInputProps={DateInputProps}
      KeyboardDateInputComponent={KeyboardDateInputComponent}
      PureDateInputComponent={PureDateInputComponent}
    >
      <DateRangePickerView<any>
        open={wrapperProps.open}
        DateInputProps={DateInputProps}
        calendars={calendars}
        currentlySelectingRangeEnd={currentlySelectingRangeEnd}
        setCurrentlySelectingRangeEnd={setCurrentlySelectingRangeEnd}
        startText={startText}
        endText={endText}
        {...pickerProps}
        {...restProps}
      />
    </ResponsiveTooltipWrapper>
  );
}) as DateRangePickerComponent;

DateRangePicker.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Regular expression to detect "accepted" symbols.
   * @default /\dap/gi
   */
  acceptRegex: PropTypes.instanceOf(RegExp),
  /**
   * If `true`, `onChange` is fired on click even if the same date is selected.
   * @default false
   */
  allowSameDateSelection: PropTypes.bool,
  autoFocus: PropTypes.bool,
  /**
   * The number of calendars that render on **desktop**.
   * @default 2
   */
  calendars: PropTypes.oneOf([1, 2, 3]),
  /**
   * Cancel text message.
   * @default 'Cancel'
   */
  cancelText: PropTypes.node,
  children: PropTypes.node,
  /**
   * className applied to the root component.
   */
  className: PropTypes.string,
  /**
   * If `true`, it shows the clear action in the picker dialog.
   * @default false
   */
  clearable: PropTypes.bool,
  /**
   * Clear text message.
   * @default 'Clear'
   */
  clearText: PropTypes.node,
  /**
   * The components used for each slot.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  components: PropTypes.object,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  componentsProps: PropTypes.object,
  /**
   * Default calendar month displayed when `value={null}`.
   */
  defaultCalendarMonth: PropTypes.any,
  /**
   * CSS media query when `Mobile` mode will be changed to `Desktop`.
   * @default '@media (pointer: fine)'
   * @example '@media (min-width: 720px)' or theme.breakpoints.up('sm')
   */
  desktopModeMediaQuery: PropTypes.string,
  /**
   * Props applied to the [`Dialog`](/api/dialog/) element.
   */
  DialogProps: PropTypes.object,
  /**
   * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
   * @default false
   */
  disableAutoMonthSwitching: PropTypes.bool,
  /**
   * If `true` the popup or dialog will immediately close after submitting full date.
   * @default `true` for Desktop, `false` for Mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop).
   */
  disableCloseOnSelect: PropTypes.bool,
  /**
   * If `true`, the picker and text field are disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * @default false
   */
  disableFuture: PropTypes.bool,
  /**
   * If `true`, todays date is rendering without highlighting with circle.
   * @default false
   */
  disableHighlightToday: PropTypes.bool,
  /**
   * Disable mask on the keyboard, this should be used rarely. Consider passing proper mask for your format.
   * @default false
   */
  disableMaskedInput: PropTypes.bool,
  /**
   * Do not render open picker button (renders only text field with validation).
   * @default false
   */
  disableOpenPicker: PropTypes.bool,
  /**
   * @default false
   */
  disablePast: PropTypes.bool,
  /**
   * Text for end input label and toolbar placeholder.
   * @default 'End'
   */
  endText: PropTypes.node,
  /**
   * Get aria-label text for control that opens picker dialog. Aria-label text must include selected date. @DateIOType
   * @default (value, utils) => `Choose date, selected date is ${utils.format(utils.date(value), 'fullDate')}`
   * @param {ParseableDate<TDateValue>} value The date from which we want to add an aria-text.
   * @param {MuiPickersAdapter<TDateValue>} utils The utils to manipulate the date.
   * @returns {string} The aria-text to render inside the dialog.
   */
  getOpenDialogAriaText: PropTypes.func,
  /**
   * Get aria-label text for switching between views button.
   * @param {CalendarPickerView} currentView The view from which we want to get the button text.
   * @returns {string} The label of the view.
   */
  getViewSwitchingButtonText: PropTypes.func,
  ignoreInvalidInputs: PropTypes.bool,
  /**
   * Props to pass to keyboard input adornment.
   */
  InputAdornmentProps: PropTypes.object,
  /**
   * Format string.
   */
  inputFormat: PropTypes.string,
  InputProps: PropTypes.object,
  /**
   * Pass a ref to the `input` element.
   */
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]),
  label: PropTypes.node,
  /**
   * Left arrow icon aria-label text.
   */
  leftArrowButtonText: PropTypes.string,
  /**
   * If `true` renders `LoadingComponent` in calendar instead of calendar view.
   * Can be used to preload information and show it in calendar.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * Custom mask. Can be used to override generate from format. (e.g. `__/__/____ __:__` or `__/__/____ __:__ _M`).
   * @default '__/__/____'
   */
  mask: PropTypes.string,
  /**
   * Max selectable date. @DateIOType
   * @default defaultMaxDate
   */
  maxDate: PropTypes.any,
  /**
   * Min selectable date. @DateIOType
   * @default defaultMinDate
   */
  minDate: PropTypes.any,
  /**
   * Ok button text.
   * @default 'OK'
   */
  okText: PropTypes.node,
  /**
   * Callback fired when date is accepted @DateIOType.
   * @param {TDateValue} date The date that was just accepted.
   */
  onAccept: PropTypes.func,
  /**
   * Callback fired when the value (the selected date range) changes @DateIOType.
   * @param {DateRange<TDate>} date The new parsed date range.
   * @param {string} keyboardInputValue The current value of the keyboard input.
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see open).
   */
  onClose: PropTypes.func,
  /**
   * Callback that fired when input value or new `value` prop validation returns **new** validation error (or value is valid after error).
   * In case of validation error detected `reason` prop return non-null value and `TextField` must be displayed in `error` state.
   * This can be used to render appropriate form error.
   *
   * [Read the guide](https://next.material-ui-pickers.dev/guides/forms) about form integration and error displaying.
   * @DateIOType
   *
   * @param {TError} reason The reason why the current value is not valid.
   * @param {TDateValue} value The invalid value.
   */
  onError: PropTypes.func,
  /**
   * Callback firing on month change. @DateIOType
   * @param {TDate} month The new month.
   */
  onMonthChange: PropTypes.func,
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see open).
   */
  onOpen: PropTypes.func,
  /**
   * Callback fired on view change.
   * @param {CalendarPickerView} view The new view.
   */
  onViewChange: PropTypes.func,
  /**
   * Control the popup or dialog open state.
   */
  open: PropTypes.bool,
  /**
   * Props to pass to keyboard adornment button.
   */
  OpenPickerButtonProps: PropTypes.object,
  /**
   * Force rendering in particular orientation.
   */
  orientation: PropTypes.oneOf(['landscape', 'portrait']),
  /**
   * Paper props passed down to [Paper](https://mui.com/api/paper/) component.
   */
  PaperProps: PropTypes.object,
  /**
   * Popper props passed down to [Popper](https://mui.com/api/popper/) component.
   */
  PopperProps: PropTypes.object,
  /**
   * Make picker read only.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * Disable heavy animations.
   * @default typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent)
   */
  reduceAnimations: PropTypes.bool,
  /**
   * Custom renderer for `<DateRangePicker />` days. @DateIOType
   * @example (date, dateRangePickerDayProps) => <DateRangePickerDay {...dateRangePickerDayProps} />
   * @param {TDate} day The day to render.
   * @param {DateRangePickerDayProps<TDate>} dateRangePickerDayProps The props of the day to render.
   * @returns {JSX.Element} The element representing the day.
   */
  renderDay: PropTypes.func,
  /**
   * The `renderInput` prop allows you to customize the rendered input.
   * The `startProps` and `endProps` arguments of this render prop contains props of [TextField](https://mui.com/api/text-field/#textfield-api),
   * that you need to forward to the range start/end inputs respectively.
   * Pay specific attention to the `ref` and `inputProps` keys.
   * @example
   * ```jsx
   * <DateRangePicker
   *  renderInput={(startProps, endProps) => (
   *   <React.Fragment>
   *     <TextField {...startProps} />
   *     <Box sx={{ mx: 2 }}> to </Box>
   *     <TextField {...endProps} />
   *   </React.Fragment>;
   *  )}
   * />
   * ````
   * @param {MuiTextFieldProps} startProps Props that you need to forward to the range start input.
   * @param {MuiTextFieldProps} endProps Props that you need to forward to the range end input.
   * @returns {React.ReactElement} The range input to render.
   */
  renderInput: PropTypes.func.isRequired,
  /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span data-mui-test="loading-progress">...</span>
   */
  renderLoading: PropTypes.func,
  /**
   * Custom formatter to be passed into Rifm component.
   * @param {string} str The un-formatted string.
   * @returns {string} The formatted string.
   */
  rifmFormatter: PropTypes.func,
  /**
   * Right arrow icon aria-label text.
   */
  rightArrowButtonText: PropTypes.string,
  /**
   * Disable specific date. @DateIOType
   * @param {TDate} day The date to check.
   * @returns {boolean} If `true` the day will be disabled.
   */
  shouldDisableDate: PropTypes.func,
  /**
   * Disable specific years dynamically.
   * Works like `shouldDisableDate` but for year selection view @DateIOType.
   * @param {TDate} year The year to test.
   * @returns {boolean} Return `true` if the year should be disabled.
   */
  shouldDisableYear: PropTypes.func,
  /**
   * If `true`, days that have `outsideCurrentMonth={true}` are displayed.
   * @default false
   */
  showDaysOutsideCurrentMonth: PropTypes.bool,
  /**
   * If `true`, the today button is displayed. **Note** that `showClearButton` has a higher priority.
   * @default false
   */
  showTodayButton: PropTypes.bool,
  /**
   * If `true`, show the toolbar even in desktop mode.
   */
  showToolbar: PropTypes.bool,
  /**
   * Text for start input label and toolbar placeholder.
   * @default 'Start'
   */
  startText: PropTypes.node,
  /**
   * Today text message.
   * @default 'Today'
   */
  todayText: PropTypes.node,
  /**
   * Component that will replace default toolbar renderer.
   */
  ToolbarComponent: PropTypes.elementType,
  /**
   * Date format, that is displaying in toolbar.
   */
  toolbarFormat: PropTypes.string,
  /**
   * Mobile picker date value placeholder, displaying if `value` === `null`.
   * @default '–'
   */
  toolbarPlaceholder: PropTypes.node,
  /**
   * Mobile picker title, displaying in the toolbar.
   * @default 'Select date range'
   */
  toolbarTitle: PropTypes.node,
  /**
   * Custom component for popper [Transition](https://mui.com/components/transitions/#transitioncomponent-prop).
   */
  TransitionComponent: PropTypes.elementType,
  /**
   * The value of the date range picker.
   */
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.any,
      PropTypes.instanceOf(Date),
      PropTypes.number,
      PropTypes.string,
    ]),
  ).isRequired,
} as any;
