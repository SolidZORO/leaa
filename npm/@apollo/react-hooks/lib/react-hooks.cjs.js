exports.__esModule = true;
exports.useApolloClient = useApolloClient;
exports.useLazyQuery = useLazyQuery;
exports.useMutation = useMutation;
exports.useQuery = useQuery;
exports.useSubscription = useSubscription;
exports.RenderPromises = exports.resetApolloContext = exports.ApolloProvider = exports.ApolloConsumer = undefined;

var _reactCommon = require("../../react-common/lib/react-common.cjs.js");

exports.getApolloContext = _reactCommon.getApolloContext;
exports.ApolloConsumer = _reactCommon.ApolloConsumer;
exports.ApolloProvider = _reactCommon.ApolloProvider;
exports.resetApolloContext = _reactCommon.resetApolloContext;

var _tslib = require("../../../tslib/tslib.js");

var _react = _interopRequireWildcard(require("../../../react/index.js"));

var _apolloClient = require("../../../apollo-client/bundle.umd.js");

var _equality = require("../../../@wry/equality/lib/equality.js");

var _tsInvariant = require("../../../ts-invariant/lib/invariant.js");

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }newObj.default = obj;return newObj;
  }
}

var OperationData = function () {
  function OperationData(options, context) {
    this.isMounted = false;
    this.previousOptions = {};
    this.context = {};
    this.options = {};
    this.options = options || {};
    this.context = context || {};
  }

  OperationData.prototype.getOptions = function () {
    return this.options;
  };

  OperationData.prototype.setOptions = function (newOptions) {
    if (!(0, _equality.equal)(this.options, newOptions)) {
      this.previousOptions = this.options;
    }

    this.options = newOptions;
  };

  OperationData.prototype.unmount = function () {
    this.isMounted = false;
  };

  OperationData.prototype.refreshClient = function () {
    var client = this.options && this.options.client || this.context && this.context.client;
    (0, _tsInvariant.invariant)(!!client, "Could not find \"client\" in the context or passed in as an option. Wrap the root component in an <ApolloProvider>, or pass an ApolloClient instance in via options.");
    var isNew = false;

    if (client !== this.client) {
      isNew = true;
      this.client = client;
      this.cleanup();
    }

    return {
      client: this.client,
      isNew: isNew
    };
  };

  OperationData.prototype.verifyDocumentType = function (document, type) {
    var operation = (0, _reactCommon.parser)(document);
    var requiredOperationName = (0, _reactCommon.operationName)(type);
    var usedOperationName = (0, _reactCommon.operationName)(operation.type);
    (0, _tsInvariant.invariant)(operation.type === type, "Running a " + requiredOperationName + " requires a graphql " + (requiredOperationName + ", but a " + usedOperationName + " was used instead."));
  };

  return OperationData;
}();

var QueryData = function (_super) {
  (0, _tslib.__extends)(QueryData, _super);

  function QueryData(_a) {
    var options = _a.options,
        context = _a.context,
        forceUpdate = _a.forceUpdate;

    var _this = _super.call(this, options, context) || this;

    _this.previousData = {};
    _this.currentObservable = {};
    _this.runLazy = false;

    _this.runLazyQuery = function (options) {
      _this.runLazy = true;
      _this.lazyOptions = options;

      _this.forceUpdate();
    };

    _this.getExecuteResult = function () {
      var result = _this.getQueryResult();

      _this.startQuerySubscription();

      return result;
    };

    _this.forceUpdate = forceUpdate;
    return _this;
  }

  QueryData.prototype.execute = function () {
    this.refreshClient();

    var _a = this.getOptions(),
        skip = _a.skip,
        query = _a.query;

    if (skip || query !== this.previousData.query) {
      this.removeQuerySubscription();
      this.previousData.query = query;
    }

    this.updateObservableQuery();
    if (this.isMounted) this.startQuerySubscription();
    return this.getExecuteSsrResult() || this.getExecuteResult();
  };

  QueryData.prototype.executeLazy = function () {
    return !this.runLazy ? [this.runLazyQuery, {
      loading: false,
      networkStatus: _apolloClient.NetworkStatus.ready,
      called: false,
      data: undefined
    }] : [this.runLazyQuery, this.execute()];
  };

  QueryData.prototype.fetchData = function () {
    if (this.getOptions().skip) return false;

    var _a = this.getOptions(),
        children = _a.children,
        ssr = _a.ssr,
        displayName = _a.displayName,
        skip = _a.skip,
        onCompleted = _a.onCompleted,
        onError = _a.onError,
        partialRefetch = _a.partialRefetch,
        opts = (0, _tslib.__rest)(_a, ["children", "ssr", "displayName", "skip", "onCompleted", "onError", "partialRefetch"]);

    var fetchPolicy = opts.fetchPolicy;
    if (ssr === false) return false;

    if (fetchPolicy === 'network-only' || fetchPolicy === 'cache-and-network') {
      fetchPolicy = 'cache-first';
    }

    var obs = this.refreshClient().client.watchQuery((0, _tslib.__assign)({}, opts, {
      fetchPolicy: fetchPolicy
    }));

    if (this.context && this.context.renderPromises) {
      this.context.renderPromises.registerSSRObservable(obs, this.getOptions());
    }

    var currentResult = this.currentObservable.query.getCurrentResult();
    return currentResult.loading ? obs.result() : false;
  };

  QueryData.prototype.afterExecute = function (_a) {
    var _this = this;

    var _b = (_a === undefined ? {} : _a).lazy,
        lazy = _b === undefined ? false : _b;
    this.isMounted = true;

    if (!lazy || this.runLazy) {
      this.handleErrorOrCompleted();
      setTimeout(function () {
        _this.currentObservable.query && _this.currentObservable.query.resetQueryStoreErrors();
      });
    }

    return this.unmount.bind(this);
  };

  QueryData.prototype.cleanup = function () {
    this.removeQuerySubscription();
    delete this.currentObservable.query;
    delete this.previousData.result;
  };

  QueryData.prototype.getOptions = function () {
    var options = _super.prototype.getOptions.call(this);

    var lazyOptions = this.lazyOptions || {};
    var updatedOptions = (0, _tslib.__assign)({}, options, {
      variables: (0, _tslib.__assign)({}, options.variables, lazyOptions.variables),
      context: (0, _tslib.__assign)({}, options.context, lazyOptions.context)
    });

    if (this.runLazy) {
      delete updatedOptions.skip;
    }

    return updatedOptions;
  };

  QueryData.prototype.getExecuteSsrResult = function () {
    var result;
    var ssrLoading = {
      loading: true,
      networkStatus: _apolloClient.NetworkStatus.loading,
      called: true,
      data: {}
    };

    if (this.context && this.context.renderPromises) {
      result = this.context.renderPromises.addQueryPromise(this, this.getExecuteResult);

      if (!result) {
        result = ssrLoading;
      }
    }

    return result;
  };

  QueryData.prototype.prepareObservableQueryOptions = function () {
    this.verifyDocumentType(this.getOptions().query, _reactCommon.DocumentType.Query);
    var displayName = this.getOptions().displayName || 'Query';
    return (0, _tslib.__assign)({}, this.getOptions(), {
      displayName: displayName,
      context: this.getOptions().context || {},
      metadata: {
        reactComponent: {
          displayName: displayName
        }
      }
    });
  };

  QueryData.prototype.observableQueryFields = function (observable) {
    return {
      variables: observable.variables,
      refetch: observable.refetch.bind(observable),
      fetchMore: observable.fetchMore.bind(observable),
      updateQuery: observable.updateQuery.bind(observable),
      startPolling: observable.startPolling.bind(observable),
      stopPolling: observable.stopPolling.bind(observable),
      subscribeToMore: observable.subscribeToMore.bind(observable)
    };
  };

  QueryData.prototype.initializeObservableQuery = function () {
    if (this.context && this.context.renderPromises) {
      this.currentObservable.query = this.context.renderPromises.getSSRObservable(this.getOptions());
    }

    if (!this.currentObservable.query) {
      var observableQueryOptions = this.prepareObservableQueryOptions();
      this.previousData.observableQueryOptions = (0, _tslib.__assign)({}, observableQueryOptions, {
        children: null
      });
      this.currentObservable.query = this.refreshClient().client.watchQuery(observableQueryOptions);
    }
  };

  QueryData.prototype.updateObservableQuery = function () {
    if (!this.currentObservable.query) {
      this.initializeObservableQuery();
    }

    var newObservableQueryOptions = (0, _tslib.__assign)({}, this.prepareObservableQueryOptions(), {
      children: null
    });

    if (!(0, _equality.equal)(newObservableQueryOptions, this.previousData.observableQueryOptions)) {
      this.previousData.observableQueryOptions = newObservableQueryOptions;
      this.currentObservable.query.setOptions(newObservableQueryOptions).catch(function () {});
    }
  };

  QueryData.prototype.startQuerySubscription = function () {
    var _this = this;

    if (this.currentObservable.subscription || this.getOptions().skip) return;
    var obsQuery = this.currentObservable.query;
    this.currentObservable.subscription = obsQuery.subscribe({
      next: function (_a) {
        var loading = _a.loading,
            networkStatus = _a.networkStatus,
            data = _a.data;

        if (_this.previousData.result && _this.previousData.result.loading === loading && _this.previousData.result.networkStatus === networkStatus && (0, _equality.equal)(_this.previousData.result.data, data || {})) {
          return;
        }

        _this.forceUpdate();
      },
      error: function (error) {
        _this.resubscribeToQuery();

        if (!error.hasOwnProperty('graphQLErrors')) throw error;

        if (!(0, _equality.equal)(error, _this.previousData.error)) {
          _this.previousData.error = error;

          _this.forceUpdate();
        }
      }
    });
  };

  QueryData.prototype.resubscribeToQuery = function () {
    this.removeQuerySubscription();
    var lastError = this.currentObservable.query.getLastError();
    var lastResult = this.currentObservable.query.getLastResult();
    this.currentObservable.query.resetLastResults();
    this.startQuerySubscription();
    Object.assign(this.currentObservable.query, {
      lastError: lastError,
      lastResult: lastResult
    });
  };

  QueryData.prototype.getQueryResult = function () {
    var result = {
      data: Object.create(null)
    };
    Object.assign(result, this.observableQueryFields(this.currentObservable.query));

    if (this.getOptions().skip) {
      result = (0, _tslib.__assign)({}, result, {
        data: undefined,
        error: undefined,
        loading: false,
        called: true
      });
    } else {
      var currentResult = this.currentObservable.query.getCurrentResult();
      var loading = currentResult.loading,
          partial = currentResult.partial,
          networkStatus = currentResult.networkStatus,
          errors = currentResult.errors;
      var error = currentResult.error,
          data = currentResult.data;
      data = data || Object.create(null);

      if (errors && errors.length > 0) {
        error = new _apolloClient.ApolloError({
          graphQLErrors: errors
        });
      }

      Object.assign(result, {
        loading: loading,
        networkStatus: networkStatus,
        error: error,
        called: true
      });

      if (loading) {
        var previousData = this.previousData.result ? this.previousData.result.data : {};
        Object.assign(result.data, previousData, data);
      } else if (error) {
        Object.assign(result, {
          data: (this.currentObservable.query.getLastResult() || {}).data
        });
      } else {
        var fetchPolicy = this.currentObservable.query.options.fetchPolicy;
        var partialRefetch = this.getOptions().partialRefetch;

        if (partialRefetch && Object.keys(data).length === 0 && partial && fetchPolicy !== 'cache-only') {
          Object.assign(result, {
            loading: true,
            networkStatus: _apolloClient.NetworkStatus.loading
          });
          result.refetch();
          return result;
        }

        Object.assign(result.data, data);
      }
    }

    result.client = this.client;
    this.previousData.loading = this.previousData.result && this.previousData.result.loading || false;
    this.previousData.result = result;
    return result;
  };

  QueryData.prototype.handleErrorOrCompleted = function () {
    var _a = this.currentObservable.query.getCurrentResult(),
        data = _a.data,
        loading = _a.loading,
        error = _a.error;

    if (!loading) {
      var _b = this.getOptions(),
          query = _b.query,
          variables = _b.variables,
          onCompleted = _b.onCompleted,
          onError = _b.onError;

      if (this.previousOptions && !this.previousData.loading && (0, _equality.equal)(this.previousOptions.query, query) && (0, _equality.equal)(this.previousOptions.variables, variables)) {
        return;
      }

      if (onCompleted && !error) {
        onCompleted(data);
      } else if (onError && error) {
        onError(error);
      }
    }
  };

  QueryData.prototype.removeQuerySubscription = function () {
    if (this.currentObservable.subscription) {
      this.currentObservable.subscription.unsubscribe();
      delete this.currentObservable.subscription;
    }
  };

  return QueryData;
}(OperationData);

function useDeepMemo(memoFn, key) {
  var ref = (0, _react.useRef)();

  if (!ref.current || !(0, _equality.equal)(key, ref.current.key)) {
    ref.current = {
      key: key,
      value: memoFn()
    };
  }

  return ref.current.value;
}

function useBaseQuery(query, options, lazy) {
  if (lazy === undefined) {
    lazy = false;
  }

  var context = (0, _react.useContext)((0, _reactCommon.getApolloContext)());

  var _a = (0, _react.useReducer)(function (x) {
    return x + 1;
  }, 0),
      tick = _a[0],
      forceUpdate = _a[1];

  var updatedOptions = options ? (0, _tslib.__assign)({}, options, {
    query: query
  }) : {
    query: query
  };
  var queryDataRef = (0, _react.useRef)();

  if (!queryDataRef.current) {
    queryDataRef.current = new QueryData({
      options: updatedOptions,
      context: context,
      forceUpdate: forceUpdate
    });
  }

  var queryData = queryDataRef.current;
  queryData.setOptions(updatedOptions);
  queryData.context = context;
  var memo = {
    options: updatedOptions,
    context: context,
    tick: tick
  };
  var result = useDeepMemo(function () {
    return lazy ? queryData.executeLazy() : queryData.execute();
  }, memo);
  (0, _react.useEffect)(function () {
    return queryData.afterExecute({
      lazy: lazy
    });
  }, [result]);
  (0, _react.useEffect)(function () {
    return function () {
      return queryData.cleanup();
    };
  }, []);
  return result;
}

function useQuery(query, options) {
  return useBaseQuery(query, options, false);
}

function useLazyQuery(query, options) {
  return useBaseQuery(query, options, true);
}

var MutationData = function (_super) {
  (0, _tslib.__extends)(MutationData, _super);

  function MutationData(_a) {
    var options = _a.options,
        context = _a.context,
        result = _a.result,
        setResult = _a.setResult;

    var _this = _super.call(this, options, context) || this;

    _this.runMutation = function (mutationFunctionOptions) {
      if (mutationFunctionOptions === undefined) {
        mutationFunctionOptions = {};
      }

      _this.onMutationStart();

      var mutationId = _this.generateNewMutationId();

      return _this.mutate(mutationFunctionOptions).then(function (response) {
        _this.onMutationCompleted(response, mutationId);

        return response;
      }).catch(function (error) {
        _this.onMutationError(error, mutationId);

        if (!_this.getOptions().onError) throw error;
      });
    };

    _this.verifyDocumentType(options.mutation, _reactCommon.DocumentType.Mutation);

    _this.result = result;
    _this.setResult = setResult;
    _this.mostRecentMutationId = 0;
    return _this;
  }

  MutationData.prototype.execute = function (result) {
    this.isMounted = true;
    this.verifyDocumentType(this.getOptions().mutation, _reactCommon.DocumentType.Mutation);
    return [this.runMutation, result];
  };

  MutationData.prototype.afterExecute = function () {
    this.isMounted = true;
    return this.unmount.bind(this);
  };

  MutationData.prototype.cleanup = function () {};

  MutationData.prototype.mutate = function (mutationFunctionOptions) {
    var _a = this.getOptions(),
        mutation = _a.mutation,
        variables = _a.variables,
        optimisticResponse = _a.optimisticResponse,
        update = _a.update,
        _b = _a.context,
        mutationContext = _b === undefined ? {} : _b,
        _c = _a.awaitRefetchQueries,
        awaitRefetchQueries = _c === undefined ? false : _c,
        fetchPolicy = _a.fetchPolicy;

    var mutateOptions = (0, _tslib.__assign)({}, mutationFunctionOptions);
    var mutateVariables = Object.assign({}, variables, mutateOptions.variables);
    delete mutateOptions.variables;
    return this.refreshClient().client.mutate((0, _tslib.__assign)({
      mutation: mutation,
      optimisticResponse: optimisticResponse,
      refetchQueries: mutateOptions.refetchQueries || this.getOptions().refetchQueries,
      awaitRefetchQueries: awaitRefetchQueries,
      update: update,
      context: mutationContext,
      fetchPolicy: fetchPolicy,
      variables: mutateVariables
    }, mutateOptions));
  };

  MutationData.prototype.onMutationStart = function () {
    if (!this.result.loading && !this.getOptions().ignoreResults) {
      this.updateResult({
        loading: true,
        error: undefined,
        data: undefined,
        called: true
      });
    }
  };

  MutationData.prototype.onMutationCompleted = function (response, mutationId) {
    var _a = this.getOptions(),
        onCompleted = _a.onCompleted,
        ignoreResults = _a.ignoreResults;

    var data = response.data,
        errors = response.errors;
    var error = errors && errors.length > 0 ? new _apolloClient.ApolloError({
      graphQLErrors: errors
    }) : undefined;

    var callOncomplete = function () {
      return onCompleted ? onCompleted(data) : null;
    };

    if (this.isMostRecentMutation(mutationId) && !ignoreResults) {
      this.updateResult({
        called: true,
        loading: false,
        data: data,
        error: error
      });
    }

    callOncomplete();
  };

  MutationData.prototype.onMutationError = function (error, mutationId) {
    var onError = this.getOptions().onError;

    if (this.isMostRecentMutation(mutationId)) {
      this.updateResult({
        loading: false,
        error: error,
        data: undefined,
        called: true
      });
    }

    if (onError) {
      onError(error);
    }
  };

  MutationData.prototype.generateNewMutationId = function () {
    return ++this.mostRecentMutationId;
  };

  MutationData.prototype.isMostRecentMutation = function (mutationId) {
    return this.mostRecentMutationId === mutationId;
  };

  MutationData.prototype.updateResult = function (result) {
    if (this.isMounted && (!this.previousResult || !(0, _equality.equal)(this.previousResult, result))) {
      this.setResult(result);
      this.previousResult = result;
    }
  };

  return MutationData;
}(OperationData);

function useMutation(mutation, options) {
  var context = (0, _react.useContext)((0, _reactCommon.getApolloContext)());

  var _a = (0, _react.useState)({
    called: false,
    loading: false
  }),
      result = _a[0],
      setResult = _a[1];

  var updatedOptions = options ? (0, _tslib.__assign)({}, options, {
    mutation: mutation
  }) : {
    mutation: mutation
  };
  var mutationDataRef = (0, _react.useRef)();

  function getMutationDataRef() {
    if (!mutationDataRef.current) {
      mutationDataRef.current = new MutationData({
        options: updatedOptions,
        context: context,
        result: result,
        setResult: setResult
      });
    }

    return mutationDataRef.current;
  }

  var mutationData = getMutationDataRef();
  mutationData.setOptions(updatedOptions);
  mutationData.context = context;
  (0, _react.useEffect)(function () {
    return mutationData.afterExecute();
  });
  return mutationData.execute(result);
}

var SubscriptionData = function (_super) {
  (0, _tslib.__extends)(SubscriptionData, _super);

  function SubscriptionData(_a) {
    var options = _a.options,
        context = _a.context,
        setResult = _a.setResult;

    var _this = _super.call(this, options, context) || this;

    _this.currentObservable = {};
    _this.setResult = setResult;

    _this.initialize(options);

    return _this;
  }

  SubscriptionData.prototype.execute = function (result) {
    var currentResult = result;

    if (this.refreshClient().isNew) {
      currentResult = this.getLoadingResult();
    }

    var shouldResubscribe = this.getOptions().shouldResubscribe;

    if (typeof shouldResubscribe === 'function') {
      shouldResubscribe = !!shouldResubscribe(this.getOptions());
    }

    if (shouldResubscribe !== false && this.previousOptions && Object.keys(this.previousOptions).length > 0 && (this.previousOptions.subscription !== this.getOptions().subscription || !(0, _equality.equal)(this.previousOptions.variables, this.getOptions().variables))) {
      this.endSubscription();
      delete this.currentObservable.query;
      currentResult = this.getLoadingResult();
    }

    this.initialize(this.getOptions());
    this.startSubscription();
    this.previousOptions = this.getOptions();
    return (0, _tslib.__assign)({}, currentResult, {
      variables: this.getOptions().variables
    });
  };

  SubscriptionData.prototype.afterExecute = function () {
    this.isMounted = true;
  };

  SubscriptionData.prototype.cleanup = function () {
    this.endSubscription();
    delete this.currentObservable.query;
  };

  SubscriptionData.prototype.initialize = function (options) {
    if (this.currentObservable.query) return;
    this.currentObservable.query = this.refreshClient().client.subscribe({
      query: options.subscription,
      variables: options.variables,
      fetchPolicy: options.fetchPolicy
    });
  };

  SubscriptionData.prototype.startSubscription = function () {
    if (this.currentObservable.subscription) return;
    this.currentObservable.subscription = this.currentObservable.query.subscribe({
      next: this.updateCurrentData.bind(this),
      error: this.updateError.bind(this),
      complete: this.completeSubscription.bind(this)
    });
  };

  SubscriptionData.prototype.getLoadingResult = function () {
    return {
      loading: true,
      error: undefined,
      data: undefined
    };
  };

  SubscriptionData.prototype.updateResult = function (result) {
    if (this.isMounted) {
      this.setResult(result);
    }
  };

  SubscriptionData.prototype.updateCurrentData = function (result) {
    var onSubscriptionData = this.getOptions().onSubscriptionData;
    this.updateResult({
      data: result.data,
      loading: false,
      error: undefined
    });

    if (onSubscriptionData) {
      onSubscriptionData({
        client: this.refreshClient().client,
        subscriptionData: result
      });
    }
  };

  SubscriptionData.prototype.updateError = function (error) {
    this.updateResult({
      error: error,
      loading: false
    });
  };

  SubscriptionData.prototype.completeSubscription = function () {
    var onSubscriptionComplete = this.getOptions().onSubscriptionComplete;
    if (onSubscriptionComplete) onSubscriptionComplete();
    this.endSubscription();
  };

  SubscriptionData.prototype.endSubscription = function () {
    if (this.currentObservable.subscription) {
      this.currentObservable.subscription.unsubscribe();
      delete this.currentObservable.subscription;
    }
  };

  return SubscriptionData;
}(OperationData);

function useSubscription(subscription, options) {
  var context = (0, _react.useContext)((0, _reactCommon.getApolloContext)());

  var _a = (0, _react.useState)({
    loading: true,
    error: undefined,
    data: undefined
  }),
      result = _a[0],
      setResult = _a[1];

  var updatedOptions = options ? (0, _tslib.__assign)({}, options, {
    subscription: subscription
  }) : {
    subscription: subscription
  };
  var subscriptionDataRef = (0, _react.useRef)();

  function getSubscriptionDataRef() {
    if (!subscriptionDataRef.current) {
      subscriptionDataRef.current = new SubscriptionData({
        options: updatedOptions,
        context: context,
        setResult: setResult
      });
    }

    return subscriptionDataRef.current;
  }

  var subscriptionData = getSubscriptionDataRef();
  subscriptionData.setOptions(updatedOptions);
  subscriptionData.context = context;
  (0, _react.useEffect)(function () {
    return subscriptionData.afterExecute();
  });
  (0, _react.useEffect)(function () {
    return subscriptionData.cleanup.bind(subscriptionData);
  }, []);
  return subscriptionData.execute(result);
}

function useApolloClient() {
  var client = _react.default.useContext((0, _reactCommon.getApolloContext)()).client;

  (0, _tsInvariant.invariant)(client, "No Apollo Client instance can be found. Please ensure that you have called `ApolloProvider` higher up in your tree.");
  return client;
}

function makeDefaultQueryInfo() {
  return {
    seen: false,
    observable: null
  };
}

var RenderPromises = function () {
  function RenderPromises() {
    this.queryPromises = new Map();
    this.queryInfoTrie = new Map();
  }

  RenderPromises.prototype.registerSSRObservable = function (observable, props) {
    this.lookupQueryInfo(props).observable = observable;
  };

  RenderPromises.prototype.getSSRObservable = function (props) {
    return this.lookupQueryInfo(props).observable;
  };

  RenderPromises.prototype.addQueryPromise = function (queryInstance, finish) {
    var info = this.lookupQueryInfo(queryInstance.getOptions());

    if (!info.seen) {
      this.queryPromises.set(queryInstance.getOptions(), new Promise(function (resolve) {
        resolve(queryInstance.fetchData());
      }));
      return null;
    }

    return finish();
  };

  RenderPromises.prototype.hasPromises = function () {
    return this.queryPromises.size > 0;
  };

  RenderPromises.prototype.consumeAndAwaitPromises = function () {
    var _this = this;

    var promises = [];
    this.queryPromises.forEach(function (promise, queryInstance) {
      _this.lookupQueryInfo(queryInstance).seen = true;
      promises.push(promise);
    });
    this.queryPromises.clear();
    return Promise.all(promises);
  };

  RenderPromises.prototype.lookupQueryInfo = function (props) {
    var queryInfoTrie = this.queryInfoTrie;
    var query = props.query,
        variables = props.variables;
    var varMap = queryInfoTrie.get(query) || new Map();
    if (!queryInfoTrie.has(query)) queryInfoTrie.set(query, varMap);
    var variablesString = JSON.stringify(variables);
    var info = varMap.get(variablesString) || makeDefaultQueryInfo();
    if (!varMap.has(variablesString)) varMap.set(variablesString, info);
    return info;
  };

  return RenderPromises;
}();

exports.RenderPromises = RenderPromises;