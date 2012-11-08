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

package controllers

import play.api.mvc._
import org.www.readwriteweb.play.auth._
import concurrent.Future
import org.w3.banana.jena.{JenaGraphSparqlEngine, Jena}
import org.www.play.auth.{WebIDAuthN, WebIDVerifier}
import views._
import org.www.play.rdf.jena.JenaConfig
import java.net.URL
import play.api.libs.ws.WS
import play.api.libs.iteratee.{Enumeratee, Enumerator, Iteratee}
import java.io.{InputStream, PrintWriter, StringWriter}

object Application extends Controller {

  import JenaConfig._

  //setup: should be moved to a special init class
  implicit def mkSparqlEngine = JenaGraphSparqlEngine.makeSparqlEngine _
  implicit val JenaWebIDVerifier = new WebIDVerifier[Jena]()

  val base = new URL("http://localhost/~hjs/")
  def meta(path: String) = {
    val i = path.lastIndexOf('/')
    val p = if (i < 0) path else path.substring(1,i+1)
    val metaURL = new URL(base,p+".meta.ttl")
    System.out.println("url: "+metaURL)
    metaURL
  }


  implicit val idGuard: IdGuard[Jena] = WebAccessControl[Jena](linkedDataCache)
  def webReq(req: RequestHeader) : WebRequest[Jena] =
    new PlayWebRequest[Jena](new WebIDAuthN[Jena],new URL("https://localhost:8443/"),meta _)(req)

  // Authorizes anyone with a valid WebID
  object WebIDAuth extends Auth[Jena](idGuard,webReq _)
  //  new WebIDAuthN[Jena](), _ => Future.successful(WebIDGroup),_=>Unauthorized("no valid webid"))


  def webId(path: String) = WebIDAuth() { authFailure =>
    Unauthorized("You are not authorized "+ authFailure)
  }
  { authReq =>
      Ok("You are authorized for " + path + ". Your ids are: " + authReq.user)
  }

  def index = Action {
    Ok(html.index("Read Write Web"));
  }

}