import React from 'react';
import { pie } from 'd3-shape';
import { render, fireEvent, screen } from '@testing-library/react';
import { PieArc } from './PieArc';
import { ChartTooltip } from '../../common';
import { vi } from 'vitest';

vi.mock('framer-motion', async () => {
  // remove framer-motion react primitives,
  // because they use svg api which is not available in jsdom
  const mod: any = await vi.importActual('framer-motion');

  return {
    ...mod,
    motion: {
      ...mod.motion,
      path: 'path',
      // for tooltip
      div: 'div'
    }
  };
});

const color = 'green';
const data = pie<any>().value((d) => d.data)([{ key: 'foo', data: 1 }]);

describe('mouse events', () => {
  it('should handle click', () => {
    const onClick = vi.fn();

    render(
      <svg>
        <PieArc
          data={data[0]}
          animated={false}
          color={color}
          onClick={onClick}
        />
      </svg>
    );

    fireEvent.click(screen.getByRole('graphics-symbol'));

    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith({
      nativeEvent: expect.any(Object),
      value: { key: 'foo', data: 1 }
    });
  });

  it.skip('should handle mouseEnter', () => {
    const onMouseEnter = vi.fn();

    render(
      <svg>
        <PieArc
          data={data[0]}
          animated={false}
          color={color}
          tooltip={null}
          onMouseEnter={onMouseEnter}
        />
      </svg>
    );

    fireEvent.mouseEnter(screen.getByRole('graphics-symbol'));

    expect(onMouseEnter).toBeCalledTimes(1);
    expect(onMouseEnter).toBeCalledWith({
      nativeEvent: expect.any(Object),
      value: { key: 'foo', data: 1 }
    });
  });

  it.skip('should handle mouseLeave', () => {
    const onMouseLeave = vi.fn();

    render(
      <svg>
        <PieArc
          data={data[0]}
          animated={false}
          color={color}
          tooltip={null}
          onMouseLeave={onMouseLeave}
        />
      </svg>
    );

    fireEvent.mouseLeave(screen.getByRole('graphics-symbol'));

    expect(onMouseLeave).toBeCalledTimes(1);
    expect(onMouseLeave).toBeCalledWith({
      nativeEvent: expect.any(Object),
      value: { key: 'foo', data: 1 }
    });
  });

  it('should not handle mouse event when disabled', () => {
    const onClick = vi.fn();
    const onMouseLeave = vi.fn();
    const onMouseEnter = vi.fn();

    render(
      <svg>
        <PieArc
          data={data[0]}
          animated={false}
          color={color}
          tooltip={null}
          disabled
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      </svg>
    );

    fireEvent.click(screen.getByRole('graphics-symbol'));
    fireEvent.mouseEnter(screen.getByRole('graphics-symbol'));
    fireEvent.mouseLeave(screen.getByRole('graphics-symbol'));

    expect(onClick).toBeCalledTimes(0);
    expect(onMouseEnter).toBeCalledTimes(0);
    expect(onMouseLeave).toBeCalledTimes(0);
  });
});

describe('tooltip', () => {
  it.skip('should toggle tooltip on mouse enter/leave', () => {
    render(
      <svg>
        <PieArc data={data[0]} animated={false} color={color} />
      </svg>
    );

    fireEvent.mouseEnter(screen.getByRole('graphics-symbol'));

    expect(screen.getByRole('tooltip')).toHaveTextContent('foo1');

    fireEvent.mouseLeave(screen.getByRole('graphics-symbol'));

    // expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it.skip('should not render tooltip if it is disabled', () => {
    render(
      <svg>
        <PieArc
          data={data[0]}
          animated={false}
          color={color}
          tooltip={<ChartTooltip disabled />}
        />
      </svg>
    );

    fireEvent.mouseEnter(screen.getByRole('graphics-symbol'));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
