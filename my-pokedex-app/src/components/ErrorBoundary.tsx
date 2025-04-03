import { Component, ReactNode } from 'react';
import { Alert, Text } from '@chakra-ui/react';

export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert.Root status="error">
          <Text>{this.state.error?.message || 'Something went wrong.'}</Text>
        </Alert.Root>
      );
    }
    return this.props.children;
  }
}
