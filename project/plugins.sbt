// Comment to get more information during initialization
logLevel := Level.Warn

//scalaVersion := "2.10.4"

// The Typesafe repository
resolvers += "Typesafe repository" at "https://repo.typesafe.com/typesafe/releases/"

// The bblfish.net repository
resolvers += "bblfish.net repository" at "https://bblfish.net/work/repo/ivy/releases/"

//resolvers += Resolver.url("bblfish ivy repository",url("http://bblfish.net/work/repo/ivy/releases/"))(Resolver.ivyStylePatterns)

// Use the Play sbt plugin for Play projects
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.2.3")
//addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.3.11-TLS")
// lazy val root = project.in(file(".")).dependsOn(playPlugin)
// lazy val playPlugin = uri("https://github.com/bblfish/Play20.git#FlexiTLS")

addSbtPlugin("com.typesafe.sbt" % "sbt-twirl" % "1.3.15")

//resolvers += "Sonatype snapshots" at "http://oss.sonatype.org/content/repositories/snapshots/"

//addSbtPlugin("com.github.mpeltonen" % "sbt-idea" % "1.6.0")

//resolvers += "Sonatype snapshots" at "http://oss.sonatype.org/content/repositories/snapshots/"

