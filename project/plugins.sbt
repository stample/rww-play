// Comment to get more information during initialization
logLevel := Level.Warn

// The Typesafe repository 
resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

// Use the Play sbt plugin for Play projects
//addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.2-SNAPSHOT")
addSbtPlugin("play" % "sbt-plugin" % "2.1-SNAPSHOT")


resolvers += "Sonatype snapshots" at "http://oss.sonatype.org/content/repositories/snapshots/"

