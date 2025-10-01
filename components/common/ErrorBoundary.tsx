"use client";

import { isDevelopment } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-background"
          role="alert"
          aria-live="assertive"
        >
          <div className="mb-4">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem
              persists.
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={this.handleRetry} className="flex items-center gap-2" aria-label="Try again">
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} aria-label="Reload the page">
              Reload Page
            </Button>
          </div>
          {isDevelopment && this.state.error && (
            <details className="mt-8 text-left max-w-2xl w-full">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">{this.state.error.stack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
