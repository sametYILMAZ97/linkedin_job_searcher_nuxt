# Contributing to LinkedIn Job Search URL Builder

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### 1. Fork the Repository

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/your-username/linkedin_job_searcher_nuxt.git
cd linkedin_job_searcher_nuxt
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### 3. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/amazing-new-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

### 4. Make Your Changes

- Write clean, documented code
- Follow the existing code style
- Add tests for new functionality
- Ensure all tests pass

### 5. Test Your Changes

```bash
# Run the full test suite
npm test

# Check TypeScript compilation
npm run type-check

# Build the project
npm run build
```

## 📝 Code Style Guidelines

### TypeScript/Vue Standards

- Use TypeScript strict mode
- Follow Vue 3 Composition API patterns
- Use Pinia for state management
- Prefer function components over class components

### Code Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in objects/arrays
- Use meaningful variable and function names

### Example Code Style

```typescript
// ✅ Good
interface LinkedInSearchParams {
  keywords: string
  location?: string
  timeFilter?: string
}

const generateURL = async (params: LinkedInSearchParams): Promise<string> => {
  const url = new URL('https://www.linkedin.com/jobs/search/')

  if (params.keywords) {
    url.searchParams.set('keywords', params.keywords)
  }

  return url.toString()
}

// ❌ Avoid
function generate_url(params) {
  var url = "https://www.linkedin.com/jobs/search/"
  if(params.keywords){
    url += "?keywords=" + params.keywords
  }
  return url
}
```

## 🧪 Testing Guidelines

### Test Requirements

- All new features must include tests
- Maintain or improve test coverage
- Tests should be descriptive and focused
- Use the Vitest testing framework

### Test Structure

```typescript
describe('FeatureName', () => {
  describe('when condition', () => {
    it('should behave correctly', () => {
      // Arrange
      const input = 'test data'

      // Act
      const result = functionUnderTest(input)

      // Assert
      expect(result).toBe('expected output')
    })
  })
})
```

## 🐛 Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/sametYILMAZ97/linkedin_job_searcher_nuxt/issues).

### Great Bug Reports Include:

- **Summary**: A quick summary of the bug
- **Steps to reproduce**: Detailed steps to reproduce the behavior
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: OS, browser, Node.js version
- **Screenshots**: If applicable
- **Additional context**: Any other relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 11]
 - Browser: [e.g. Chrome 91]
 - Node.js version: [e.g. 18.17.0]
 - App version: [e.g. 2.0.0]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check existing issues first
2. Describe the feature clearly
3. Explain why it would be useful
4. Consider backward compatibility
5. Be willing to help implement it

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 🔄 Pull Request Process

### Before Submitting

1. ✅ Code follows style guidelines
2. ✅ Self-review completed
3. ✅ Tests added/updated and passing
4. ✅ Documentation updated if needed
5. ✅ No console errors or warnings
6. ✅ TypeScript compilation successful

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or breaking changes documented)
```

## 📚 Development Resources

### Useful Links

- [Nuxt 3 Documentation](https://nuxt.com/)
- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)
- [Pinia Store](https://pinia.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest Testing](https://vitest.dev/)

### Project-Specific Documentation

- Check inline code comments
- Review existing test files for patterns
- Look at component examples in `/components`
- Study the store implementation in `/stores`

## 🤝 Community Guidelines

### Be Respectful

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community

### Be Collaborative

- Help others learn and grow
- Share knowledge and resources
- Provide constructive feedback
- Celebrate others' contributions

## 📞 Getting Help

- **Documentation**: Start with this README and code comments
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: Request reviews from maintainers

## 🏷️ Versioning

We use [Semantic Versioning](http://semver.org/) for releases:

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
