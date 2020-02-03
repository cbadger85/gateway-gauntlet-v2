import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'mutationobserver-shim';
import '@testing-library/jest-dom';

configure({ adapter: new Adapter() });
