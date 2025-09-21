import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from './App';
import { Linking } from 'react-native';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.Linking = {
    openURL: jest.fn(),
  };

  return RN;
});

test('renders correctly', () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId('heading')).toHaveTextContent(/Welcome/);
});

describe('App Component', () => {
  beforeEach(() => {
    (Linking.openURL as jest.Mock).mockClear();
  });

  it('should render the main welcome heading', () => {
    render(<App />);
    const heading = screen.getByTestId('heading');
    expect(heading).toHaveTextContent(/Welcome Mobile/);
  });

  it('should attempt to scroll when "What\'s next?" button is pressed', () => {
    render(<App />);

    const whatsNextButton = screen.getByText("What's next?");

    fireEvent.press(whatsNextButton);
  });

  it('should open the documentation link when pressed', () => {
    render(<App />);

    const documentationLink = screen.getByText('Documentation');

    fireEvent.press(documentationLink);

    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://nx.dev/getting-started/intro?utm_source=nx-project'
    );
  });

  it('should open the blog link when pressed', () => {
    render(<App />);

    const blogLink = screen.getByText('Blog');

    fireEvent.press(blogLink);

    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://nx.dev/blog/?utm_source=nx-project'
    );
  });

  it('should open the GitHub link when the star button is pressed', () => {
    render(<App />);

    const starLink = screen.getByText(/Love Nx\? Give us a star!/i);

    fireEvent.press(starLink);

    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://nx.dev/nx-cloud?utm_source=nx-project'
    );
  });

  it('should open Youtube link when pressed', () => {
    render(<App />);
    const youtubeLink = screen.getByText('Youtube channel');
    fireEvent.press(youtubeLink);
    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://www.youtube.com/@NxDevtools/videos?utm_source=nx-project'
    );
  });

  it('should open the interactive tutorials link when pressed', () => {
    render(<App />);
    const tutorialsLink = screen.getByText('Interactive tutorials');
    fireEvent.press(tutorialsLink);
    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://nx.dev/nx-api/expo/documents/overview'
    );
  });

  it('should open the VSCode extension link when pressed', () => {
    render(<App />);
    const vscodeLink = screen.getByText('Install Nx Console for VSCode');
    fireEvent.press(vscodeLink);
    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console&utm_source=nx-project'
    );
  });

  it('should open the JetBrains extension link when pressed', () => {
    render(<App />);
    const jetbrainsLink = screen.getByText('Install Nx Console for JetBrains');
    fireEvent.press(jetbrainsLink);
    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://plugins.jetbrains.com/plugin/21060-nx-console'
    );
  });

  it('should call openURL when the "Click here to finish" button for Nx Cloud is pressed', () => {
    render(<App />);
    const nxCloudButton = screen.getByText('Click here to finish');
    fireEvent.press(nxCloudButton);
    expect(Linking.openURL).toHaveBeenCalledWith('');
  });
});
