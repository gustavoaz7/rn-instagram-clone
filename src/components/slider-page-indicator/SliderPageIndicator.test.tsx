import React from 'react';
import { render } from '@testing-library/react-native';
import { SliderPageIndicator, DELAY } from './SliderPageIndicator';
import { Providers } from '../../Providers';
import {
  setupTimeTravel,
  destroyTimeTravel,
  timeTravel,
} from '../../test/time-travel';
import { defaultTheme } from '../../test/default-theme';

describe('components - SliderPageIndicator', () => {
  const options = { wrapper: Providers };
  const props = { total: 4, current: 3 };

  beforeEach(() => {
    setupTimeTravel();
  });

  afterEach(() => {
    destroyTimeTravel();
  });

  it('renders', () => {
    render(<SliderPageIndicator {...props} />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<SliderPageIndicator {...props} />, options);

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correct text', () => {
    const { getByText } = render(<SliderPageIndicator {...props} />, options);

    expect(getByText(`${props.current}/${props.total}`)).toBeTruthy();
  });

  it('renders correct text', () => {
    const { getByText } = render(<SliderPageIndicator {...props} />, options);

    expect(getByText(`${props.current}/${props.total}`)).toBeTruthy();
  });

  describe('animation', () => {
    it('starts visible', () => {
      const { getByText } = render(<SliderPageIndicator {...props} />, options);

      expect(getByText(`${props.current}/${props.total}`)).toHaveStyle({
        opacity: 1,
      });
    });

    describe('when stays on same page', () => {
      it('keeps visible', () => {
        const { getByText } = render(
          <SliderPageIndicator {...props} />,
          options,
        );

        timeTravel(DELAY * 2);

        expect(getByText(`${props.current}/${props.total}`)).toHaveStyle({
          opacity: 1,
        });
      });
    });

    describe('when changes page', () => {
      it(`hides after ${DELAY}ms`, () => {
        const { getByText, rerender } = render(
          <SliderPageIndicator total={4} current={2} />,
          options,
        );

        rerender(<SliderPageIndicator total={4} current={3} />);
        timeTravel(DELAY + defaultTheme.animation.timingSlow);

        expect(getByText('3/4')).toHaveStyle({ opacity: 0 });
      });

      describe('when go back to initial page', () => {
        it(`still hides after ${DELAY}ms`, () => {
          const { getByText, rerender } = render(
            <SliderPageIndicator total={4} current={2} />,
            options,
          );

          rerender(<SliderPageIndicator total={4} current={3} />);
          rerender(<SliderPageIndicator total={4} current={2} />);
          timeTravel(DELAY + defaultTheme.animation.timingSlow);

          expect(getByText('2/4')).toHaveStyle({ opacity: 0 });
        });
      });
    });
  });
});
