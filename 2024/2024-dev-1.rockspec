package = "2024"
version = "dev-1"
source = {
   url = "git+ssh://git@github.com/EagleLizard/advent-of-code.git"
}
description = {
   homepage = "*** please enter a project homepage ***",
   license = "*** please specify a license ***"
}
build = {
   type = "builtin",
   modules = {
      main = "src/main.lua"
   },
   install = {
      bin = {
         "bin/aoc2024"
      }
   }
}
dependencies = {
   "luafilesystem"
}
