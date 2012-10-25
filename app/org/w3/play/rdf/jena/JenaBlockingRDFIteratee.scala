/*
 * Copyright 2012 Henry Story, http://bblfish.net/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.w3.play.rdf.jena

import org.w3.banana.jena.{Jena, JenaGraphSyntax, JenaOperations}
import org.w3.banana.{Turtle, RDFXML, RDFReader}
import org.w3.play.rdf.{IterateeSelector, RDFIteratee, BlockingRDFIteratee}

/**
 *
 * Date: 27/06/2012
 */

object JenaBlockingRDFIteratee  {
  implicit val ops = JenaOperations
  import org.w3.banana.jena.Jena.{turtleReader,rdfxmlReader}

  def apply[SyntaxType](implicit jenaSyntax: JenaGraphSyntax[SyntaxType],
                        reader: RDFReader[Jena, SyntaxType]) = new BlockingRDFIteratee[Jena,SyntaxType]

  implicit val RDFXMLIteratee: RDFIteratee[Jena#Graph,RDFXML] = JenaBlockingRDFIteratee[RDFXML]
  implicit val TurtleIteratee: RDFIteratee[Jena#Graph,Turtle] = JenaBlockingRDFIteratee[Turtle]

  val rdfxmlSelector = IterateeSelector[Jena#Graph, RDFXML]
  val turtleSelector = IterateeSelector[Jena#Graph, Turtle]

  implicit val BlockingIterateeSelector: IterateeSelector[Jena#Graph] =
    rdfxmlSelector combineWith turtleSelector


}