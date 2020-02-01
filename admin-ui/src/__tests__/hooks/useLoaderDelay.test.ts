import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useLoaderDelay } from '../../hooks/useLoaderDelay';

describe('useLoaderDelay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should initially return false if the predicate is true', () => {
    const { result } = renderHook(() => useLoaderDelay(true));

    expect(result.current).toBe(false);
  });

  it('should return true when the timer is up if the predicate is true', () => {
    const { result } = renderHook(() => useLoaderDelay(true));

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current).toBe(true);
  });

  it('should return false if the predicate is false', () => {
    const { result } = renderHook(() => useLoaderDelay(false));
    expect(result.current).toBe(false);

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current).toBe(false);
  });
});
