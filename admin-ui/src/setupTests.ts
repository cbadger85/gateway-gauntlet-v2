import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'mutationobserver-shim';
import '@testing-library/jest-dom';
import 'jest-localstorage-mock';

configure({ adapter: new Adapter() });
