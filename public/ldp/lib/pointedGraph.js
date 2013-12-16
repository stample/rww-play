/**
 *
 * @param store Quand Store
 * @param pointer onto an object.  Type : $rdf.sym() - ie Literal, Bnode, or URI
 * @param graphName name of graph in which to point - // Type : $rdf.sym() but limited to URI
 * @return {$rdf.PointedGraph}
 */
$rdf.pointedGraph = function(store, pointer, graphName) {
	return new $rdf.PointedGraph(store, pointer, graphName);
};

$rdf.PointedGraph = function() {
	$rdf.PointedGraph = function(graph, pointer, graphName, useProxy){
		this.graph = graph;
		this.pointer = pointer; //# // Type : $rdf.sym()
		this.graphName = graphName; // Type : $rdf.sym()
		this.useProxy = useProxy ;
	};

	$rdf.PointedGraph.prototype.constructor = $rdf.PointedGraph;

	$rdf.PointedGraph.prototype.rev = function (relUri) {
		console.log("***********$rdf.PointedGraph.prototype.rev*******************");
		var g = this.graph;
		var n = this.graphName;
		var p = this.pointer;

		// Select all that matches the relation relUri.
		var resList = g.statementsMatching(undefined, relUri, p, n, false);
		console.log(resList);

		// Create as much PG as q results.
		var pgList = _.map(resList, function (it) {
			return new $rdf.PointedGraph(g, it.subject, n);
		});

		return pgList;
	}

	// Is the symbol defined in the named graph pointed to by this PointedGraph
	$rdf.PointedGraph.prototype.isLocal = function (symbol) {
		var gName = this.graphName;
		if (symbol.termType == 'literal' || symbol.termType == 'bnode') {
			return true
		} else {
			//todo: not perfect ( does not take care of 303 redirects )
			var doc = symbol.uri.split('#')[0];
			return gName && doc == gName.uri;
		}
	}

	$rdf.PointedGraph.prototype.isLocalPointer = function() {
		return this.isLocal(this.pointer)
	}

	$rdf.PointedGraph.prototype.observableRel = function(relUri) {
		var self = this;
		//for each pg in pgList
		//if pg is a bnode or a literal or a local URI
		// then return bnode as Obvervable result
		// else
		// fetch remote graph and create a new PG with the right pointer,
		// and return that as an Observable result
		//return observer?

		var pgList = this.rel(relUri);
		var localRemote = _.groupBy(pgList,function(pg){return pg.isLocalPointer()});
		var source1 = Rx.Observable.fromArray(localRemote.true);
		var source2 = Rx.Observable.create(function(observer) {
			_.map(localRemote.false, function(pg) {
				var f = $rdf.fetcher(pg.graph);
				var docURL = pg.pointer.uri.split('#')[0];
				console.log("Proxy : "+ self.useProxy);
				var promise = f.fetch(docURL, pg.graphName, self.useProxy);
				promise.then(
					function(x){
						//todo: need to deal with errors
						console.log("Observable rel = On Next");
						console.log(x);
						observer.onNext(new $rdf.PointedGraph(pg.graph,pg.pointer, $rdf.sym(docURL)))
					},
					function(err) {
						console.log("Observable rel = Error");
						console.log(err);
						observer.onError(err)
					}
				);
			})
		});

		return source1.merge(source2);
	}

	//$rdf.PointedGraph.prototype.fetch = function(relUri) {

	$rdf.PointedGraph.prototype.rel = function (relUri) {
		console.log("***********$rdf.PointedGraph.prototype.rel*******************");
		var g = this.graph;
		var n = this.graphName;
		var p = this.pointer;
		console.log(this);
		console.log(g);
		console.log(n);
		console.log(p);
		console.log(relUri);

		// Select all that matches the relation relUri.
		var resList = g.statementsMatching(p, relUri, undefined, n, false);
		//var resList = this.graph.statementsMatching(this.pointer, relUri, undefined, this.graphName);
		console.log('RestList');
		console.log(resList);

		// Create as much PG as q results.
		var pgList = _.map(resList, function (it) {
			return new $rdf.PointedGraph(g, it.object, n);
		});

		return pgList;
	}

	$rdf.PointedGraph.prototype.relBnode = function (relUri) {
		console.log("***********$rdf.PointedGraph.prototype.rel*******************");
		var g = this.graph;
		var n = this.graphName;
		var p = this.pointer;
		console.log(this);
		console.log(g);
		console.log(n);
		console.log(p);
		console.log(relUri);

		// Select all that matches the relation relUri.
		var resList = g.statementsMatching(p, relUri, undefined, n, false);
		//var resList = this.graph.statementsMatching(this.pointer, relUri, undefined, this.graphName);
		console.log('RestList');
		console.log(resList);

		_.map(resList, function(statement) {
			var symbol = statement.object;
			if (symbol.termType == 'bnode') {
				console.log('Blank Node ');
				console.log(symbol);
				var rTest = g.statementsMatching(symbol, undefined, undefined, n, false);
				console.log(rTest);
			}
		});

		// Create as much PG as q results.
		var pgList = _.map(resList, function (it) {
			return new $rdf.PointedGraph(g, it.object, n);
		});

		return pgList;
	}

	$rdf.PointedGraph.prototype.rel2 = function (relUri) {
		console.log("***********$rdf.PointedGraph.prototype.rel*******************");
		var g = this.graph;
		var n = this.graphName;
		var p = this.pointer;
		console.log(this);
		console.log(g);
		console.log(n);
		console.log(p);
		console.log(relUri);

		// Select all that matches the relation relUri.
		//11111
		var resList = g.statementsMatching(undefined, relUri, undefined, n, false);
		//var resList = this.graph.statementsMatching(this.pointer, relUri, undefined, this.graphName);
		console.log('RestList');
		console.log(resList);

		_.map(resList, function(statement) {
			var symbol = statement.subject;
			console.log('Symbol is : ');
			console.log(symbol);
			if (symbol.termType == 'bnode') {
				console.log('It is a Blank Node 1 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
				var rTest1 = g.statementsMatching(undefined, undefined, symbol, n, false);
				console.log(rTest1);
				_.map(rTest1, function(statement2) {
					var symbol2 = statement2.subject;
					console.log('Symbol2 is : ');
					console.log(symbol2);
					if (symbol2.termType == 'bnode') {
						console.log('It is a Blank Node 2 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!' );
						console.log(symbol2);
						var rTest2 = g.statementsMatching(undefined, undefined, symbol2, n, false);
						console.log(rTest2);

						_.map(rTest2, function(statement3) {
							var symbol3 = statement3.subject;
							console.log('Symbol3 is : ');
							console.log(symbol3);

							if (symbol3.value == p.uri ) {
								console.log('Pareilllll');
								resList = resList;
							}

							if (symbol3.termType == 'bnode') {
								console.log('Blank Node 3');
								console.log(symbol3);
								var rTest3 = g.statementsMatching(undefined, undefined, symbol3, n, false);
								console.log(rTest3);
							}
						})
					}
				})


			}
		});

		// Create as much PG as q results.
		console.log(resList);
		var pgList = _.map(resList, function (it) {
			return new $rdf.PointedGraph(g, it.object, n);
		});

		return pgList;
	}

	$rdf.PointedGraph.prototype.relFirst = function(relUri) {
		var l = $rdf.PointedGraph.prototype.rel(relUri);
		if (l.length > 0) return l[0];
	}

	$rdf.PointedGraph.prototype.future = function(pointer, name) {
		$rdf.PointedGraph(this.graph, pointer, this.graphName)
	}

	$rdf.PointedGraph.prototype.print= function() {
		return "PG(<"+this.pointer+">, <"+this.graphName+"> = { "+
		$rdf.Serializer(this.graph).statementsToN3(this.graph.statementsMatching(undefined, undefined, undefined, this.graphName)) + "}"

	}

	return $rdf.PointedGraph;
}();
