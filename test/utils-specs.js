// transpile:mocha

import { utils } from '..';
import * as tp from 'teen_process';
import chai from 'chai';
import { withMocks, verify, stubEnv } from 'appium-test-support';
import { fs } from 'appium-support';


chai.should();

describe('utils', () => {
  describe('getInstrumentsPath', withMocks({tp}, (mocks) => {
    it('should retrieve path', async () => {
      mocks.tp
        .expects('exec')
        .once()
        .returns(Promise.resolve({stdout: '/a/b/c/d\n', stderr:'' }));
      (await utils.getInstrumentsPath()).should.equal('/a/b/c/d');
      verify(mocks);
    });
  }));
  describe('getAvailableDevices', withMocks({tp}, (mocks) => {
    it('should work', async () => {
      mocks.tp
        .expects('exec')
        .once()
        .returns(Promise.resolve({stdout: '/a/b/c/d\n', stderr:'' }));
      mocks.tp
        .expects('exec')
        .once()
        .returns(Promise.resolve({stdout: 'iphone1\niphone2\niphone3', stderr:'' }));
      (await utils.getAvailableDevices()).should.deep.equal(
        ['iphone1', 'iphone2', 'iphone3']);
      verify(mocks);
    });
  }));
  describe('killAllInstruments', withMocks({tp}, (mocks) => {
    it('should work', async () => {
      mocks.tp
        .expects('exec')
        .once()
        .returns(Promise.resolve({stdout: '', stderr:'' }));
      await utils.killAllInstruments();
      verify(mocks);
    });
  }));
  describe('cleanAllTraces', withMocks({fs}, (mocks) => {
    stubEnv();
    it('should work', async () => {
      process.env.CLEAN_TRACES = 1;
      mocks.fs
        .expects('rimraf')
        .once()
        .returns(Promise.resolve({stdout: '', stderr:'' }));
      await utils.cleanAllTraces();
      verify(mocks);
    });
  }));
  describe('parseLaunchTimeout', () => {
    stubEnv();
    it('should work', () => {
      utils.parseLaunchTimeout(90000).should.deep.equal({
        global: 90000 });
      utils.parseLaunchTimeout('90000').should.deep.equal({
        global: 90000 });
      utils.parseLaunchTimeout({global: 90000, afterLaunch: 30000}).should.deep.equal({
        global: 90000, afterLaunch: 30000 });
      utils.parseLaunchTimeout('{"global": 90000, "afterLaunch": 30000}').should.deep.equal({
        global: 90000, afterLaunch: 30000 });
    });
  });
  describe('getIwdPath', withMocks({fs}, (mocks) => {
    it('should work when path is found', async () => {
      mocks.fs
        .expects('exists')
        .once()
        .returns(Promise.resolve(true));
      (await utils.getIwdPath('10')).should.match(
        /.*thirdparty\/iwd10/);
      verify(mocks);
    });
    it('should work when path is not found', async () => {
      mocks.fs
        .expects('exists')
        .once()
        .returns(Promise.resolve(false));
      (await utils.getIwdPath('10')).should.match(
        /.*thirdparty\/iwd/);
      verify(mocks);
    });
  }));
});
