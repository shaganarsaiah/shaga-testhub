# SHAGA TestHub Repository Module

## Purpose

This module provides all repository-related functionality for SHAGA TestHub.

## Components

### Repository Loader

Loads Question Banks.

### Repository Service

Provides repository access.

### Repository Validator

Validates Question Objects.

### Repository Search

Searches Questions.

### Repository Filter

Filters Questions.

## Design Principle

Each file performs one responsibility only.

The Test Generator communicates with the Repository Service.

The CBT Engine never accesses Question Banks directly.