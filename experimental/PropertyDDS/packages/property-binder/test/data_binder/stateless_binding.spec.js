/*!
 * Copyright (c) Autodesk, Inc. All rights reserved.
 * Licensed under the MIT License.
 */
/* globals sinon, expect, should */
import { DataBinder } from '../../src/data_binder/data_binder';
import { SingletonDataBinding, StatelessDataBinding } from '../../src/data_binder/stateless_data_binding';
import { catchConsoleErrors } from './catch_console_errors';

import {
  registerTestTemplates, AnimalSchema, DogSchema, CatSchema, ChinchillaSchema
} from './testTemplates';

import { PropertyFactory } from '@fluid-experimental/property-properties';

describe('Stateless Binder', function () {
  catchConsoleErrors();

  let hfdm;
  let workspace;
  let dataBinder;

  let numCats = 0;
  let numDogs = 0;
  let numChinchillas = 0;

  const createCat = function (in_initialValues) {
    numCats++;
    return PropertyFactory.create(CatSchema.typeid, 'single', in_initialValues);
  };

  const createDog = function (in_initialValues) {
    numDogs++;
    return PropertyFactory.create(DogSchema.typeid, 'single', in_initialValues);
  };

  const createChincilla = function (in_initialValues) {
    numChinchillas++;
    return PropertyFactory.create(ChinchillaSchema.typeid, 'single', in_initialValues);
  };

  /**
   * Test class
   */
  class TestStatelessBinding extends StatelessDataBinding {
    /**
     * Constructor
     * @param {Object} params - params
     */
    constructor(params) {
      super(params);
      this.modifiedNames = [];

      // we just need to create default spies for these functions
      this.onPostCreate = jest.fn();
      this.onPreModify = jest.fn();
      this.onPreRemove = jest.fn();
      // we need to amend these functions with spies (this way we won't have to reset() them)
      this.onModify = sinon.spy(this, 'onModify');
      this.onRemove = sinon.spy(this, 'onRemove');
    }

    /**
     * @inheritdoc
     */
    onModify(in_modificationContext) {
      this.modifiedNames.push(this.getProperty().get('name').getValue());
      // both our stateless binding and the modificationContext should point to the same Property
      expect(this.getProperty()).toEqual(in_modificationContext.getProperty());
    }

    /**
     * @inheritdoc
     */
    onRemove(in_removalContext) {
    }
  }
  /**
   * Test class for the deprecated API
   */
  class TestSingletonBinding extends SingletonDataBinding {
    /**
     * Constructor
     * @param {Object} params - params
     */
    constructor(params) {
      super(params);
      this.modifiedNames = [];

      // we just need to create default spies for these functions
      this.onPostCreate = jest.fn();
      this.onPreModify = jest.fn();
      this.onPreRemove = jest.fn();
      // we need to amend these functions with spies (this way we won't have to reset() them)
      this.onModify = sinon.spy(this, 'onModify');
      this.onRemove = sinon.spy(this, 'onRemove');
    }

    /**
     * @inheritdoc
     */
    onModify(in_modifyContext) {
      this.modifiedNames.push(this.getProperty().get('name').getValue());
    }

    /**
     * @inheritdoc
     */
    onRemove(in_removalContext) {
    }
  }

  registerTestTemplates();

  expect(PropertyFactory.validate(AnimalSchema).isValid).toEqual(true);
  expect(PropertyFactory.validate(CatSchema).isValid).toEqual(true);
  expect(PropertyFactory.validate(DogSchema).isValid).toEqual(true);
  expect(PropertyFactory.validate(ChinchillaSchema).isValid).toEqual(true);

  let animalSingleton;
  let catSingleton;
  let dogSingleton;
  let chinchillaSingleton;
  const catUserData = {};

  let animalHandle;
  let catHandle;
  let dogHandle;
  let chinchillaHandle;

  beforeEach(function () {
    numCats = 0;
    numDogs = 0;
    numChinchillas = 0;

    hfdm = new HFDM();
    workspace = hfdm.createWorkspace();
    dataBinder = new DataBinder();

    return workspace.initialize({ local: true })
      .then(function () {
        dataBinder.attachTo(workspace);

        // Register the entities
        animalSingleton = new TestStatelessBinding();
        catSingleton = new TestStatelessBinding({ userData: catUserData }); // cats have userdata
        dogSingleton = new TestStatelessBinding();
        chinchillaSingleton = new TestStatelessBinding();

        catHandle = dataBinder.registerStateless('DataBindingTest', CatSchema.typeid, catSingleton);
        dogHandle = dataBinder.registerStateless('DataBindingTest', DogSchema.typeid, dogSingleton);
        chinchillaHandle = dataBinder.registerStateless(
          'DataBindingTest',
          ChinchillaSchema.typeid,
          chinchillaSingleton
        );

        // We register 'Animal' in a different namespace. The DataBinder will always choose the 'best'
        // binding within a namespace, so all the bindings in the DataBindingTest namespace will be bound to
        // the leaf classes; in the DataBindingTestAnimal namespace, it will use Animal.
        animalHandle = dataBinder.registerStateless('DataBindingTestAnimal', AnimalSchema.typeid, animalSingleton);

        // Cats are just children of the root
        workspace.insert('markcat', createCat({ name: 'Mark' }));
        workspace.insert('harrycat', createCat({ name: 'Harry' }));
        workspace.insert('bobcat', createCat({ name: 'Bob' }));

        // The dogs use arrays
        const array = PropertyFactory.create(DogSchema.typeid, 'array');
        workspace.insert('dogarray', array);
        array.push(createDog({ name: 'Amanda' }));
        array.push(createDog({ name: 'Karen' }));

        // Chinchillas are in maps
        const chinchillaMap = PropertyFactory.create(ChinchillaSchema.typeid, 'map');
        workspace.insert('chinchillamap', chinchillaMap);
        chinchillaMap.insert('pedro', createChincilla({ name: 'Pedro' }));
        chinchillaMap.insert('alessandro', createChincilla({ name: 'Alessandro' }));

        // A map of animals
        const animalMap = PropertyFactory.create(AnimalSchema.typeid, 'map');
        workspace.insert('animalmap', animalMap);
        animalMap.insert('thedog', createDog({ name: 'Woofers' }));
        animalMap.insert('thecat', createCat({ name: 'Mittens' }));
        animalMap.insert('thechinchilla', createChincilla({ name: 'Andres' }));
      });
  });

  // #region Create callback counts
  it('should get called back for onPostCreate', function () {
    expect(catSingleton.onPostCreate).toHaveBeenCalledTimes(numCats);
    expect(dogSingleton.onPostCreate).toHaveBeenCalledTimes(numDogs);
    expect(chinchillaSingleton.onPostCreate).toHaveBeenCalledTimes(numChinchillas);
    expect(animalSingleton.onPostCreate).toHaveBeenCalledTimes(numCats + numDogs + numChinchillas);
  });
  // #endregion Callback counts

  // #region Modify callback counts
  it('should get called back for onModify', function () {
    workspace.get(['markcat', 'attitude']).setValue(1);
    workspace.get(['harrycat', 'attitude']).setValue(2);
    workspace.get(['dogarray', 1, 'salivaPower']).setValue(1000);
    workspace.get(['animalmap', 'thechinchilla', 'furLength']).setValue(10);

    expect(catSingleton.onModify).toHaveBeenCalledTimes(2);
    catSingleton.modifiedNames.should.deep.equal(['Mark', 'Harry']);
    expect(dogSingleton.onModify).toHaveBeenCalledTimes(1);
    dogSingleton.modifiedNames.should.deep.equal(['Karen']);
    expect(chinchillaSingleton.onModify).toHaveBeenCalledTimes(1);
    chinchillaSingleton.modifiedNames.should.deep.equal(['Andres']);
    expect(animalSingleton.onModify).toHaveBeenCalledTimes(4);
    animalSingleton.modifiedNames.should.deep.equal(['Mark', 'Harry', 'Karen', 'Andres']);
  });
  // #endregion Modify callback counts

  // #region Removal callback counts
  it('should get called back for onRemove', function () {
    workspace.remove(workspace.get(['markcat']));
    workspace.get(['dogarray']).remove(1);
    workspace.get(['animalmap']).remove('thechinchilla');

    expect(dogSingleton.onPreRemove).toHaveBeenCalledTimes(1);
    expect(dogSingleton.onRemove).toHaveBeenCalledTimes(1);

    expect(catSingleton.onPreRemove).toHaveBeenCalledTimes(1);
    expect(catSingleton.onRemove).toHaveBeenCalledTimes(1);

    expect(chinchillaSingleton.onPreRemove).toHaveBeenCalledTimes(1);
    expect(chinchillaSingleton.onRemove).toHaveBeenCalledTimes(1);

    expect(animalSingleton.onPreRemove).toHaveBeenCalledTimes(3);
    expect(animalSingleton.onRemove).toHaveBeenCalledTimes(3);
  });
  // #endregion Removal callback counts

  // #region Unregister check
  it('should be able to unregister', function () {
    animalHandle.destroy();
    catHandle.destroy();
    dogHandle.destroy();
    chinchillaHandle.destroy();

    expect(dogSingleton.onPreRemove).toHaveBeenCalledTimes(dogSingleton.onRemove.callCount);
    expect(catSingleton.onPreRemove).toHaveBeenCalledTimes(catSingleton.onRemove.callCount);
    expect(chinchillaSingleton.onPreRemove).toHaveBeenCalledTimes(chinchillaSingleton.onRemove.callCount);
    expect(animalSingleton.onPreRemove).toHaveBeenCalledTimes(animalSingleton.onRemove.callCount);
  });
  // #endregion Unregister check

  it('should not be able to unregister twice', function () {
    animalHandle.destroy();
    catHandle.destroy();
    dogHandle.destroy();
    chinchillaHandle.destroy();

    (function () { animalHandle.destroy(); }).should.throw(Error);
    (function () { catHandle.destroy(); }).should.throw(Error);
    (function () { dogHandle.destroy(); }).should.throw(Error);
    (function () { chinchillaHandle.destroy(); }).should.throw(Error);
  });

  it('should not hear about changes after unregistering', function () {
    animalHandle.destroy();
    catHandle.destroy();
    dogHandle.destroy();
    chinchillaHandle.destroy();

    const animalBeforeCount = animalSingleton.onModify.callCount;
    const catBeforeCount = catSingleton.onModify.callCount;
    const dogBeforeCount = dogSingleton.onModify.callCount;
    const chinchillaBeforeCount = chinchillaSingleton.onModify.callCount;

    workspace.get(['harrycat', 'attitude']).setValue(10000);
    expect(catSingleton.onModify).toHaveBeenCalledTimes(catBeforeCount);

    workspace.get(['dogarray', 0, 'salivaPower']).setValue(10000);
    expect(dogSingleton.onModify).toHaveBeenCalledTimes(dogBeforeCount);

    workspace.get(['chinchillamap', 'pedro', 'furLength']).setValue(10000);
    expect(chinchillaSingleton.onModify).toHaveBeenCalledTimes(chinchillaBeforeCount);

    expect(animalSingleton.onModify).toHaveBeenCalledTimes(animalBeforeCount);
  });

  it('should get the correct databinder instance', function () {
    expect(catSingleton.getDataBinder()).toEqual(dataBinder);
    expect(dogSingleton.getDataBinder()).toEqual(dataBinder);
    expect(animalSingleton.getDataBinder()).toEqual(dataBinder);
  });

  it('should get the correct databinding type', function () {
    expect(catSingleton.getDataBindingType()).toEqual('DataBindingTest');
    expect(dogSingleton.getDataBindingType()).toEqual('DataBindingTest');
    expect(animalSingleton.getDataBindingType()).toEqual('DataBindingTestAnimal');
  });

  it('should get the correct userdata', function () {
    expect(catSingleton.getUserData()).toEqual(catUserData);
    should.not.exist(dogSingleton.getUserData());
    should.not.exist(animalSingleton.getUserData());
  });

  it('using the deprecated API should still work', function () {
    // Register a singleton using the deprecated API
    const deprecatedCat = new TestSingletonBinding({ dataBinder: dataBinder });
    const singletonHandle = dataBinder.registerSingleton('SingletonTest', CatSchema.typeid, deprecatedCat);

    workspace.get(['markcat', 'attitude']).setValue(1);
    workspace.get(['harrycat', 'attitude']).setValue(2);

    expect(deprecatedCat.onModify).toHaveBeenCalledTimes(2);
    deprecatedCat.modifiedNames.should.deep.equal(['Mark', 'Harry']);

    singletonHandle.destroy();

    // should not hear about changes to cats anymore
    const catBeforeCount = deprecatedCat.onModify.callCount;

    workspace.get(['harrycat', 'attitude']).setValue(10000);
    expect(deprecatedCat.onModify).toHaveBeenCalledTimes(catBeforeCount);
  });
});
